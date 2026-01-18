const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const { createHmac } = require("crypto");
const { welcomeMail, forgotPasswordMail } = require("../util/mailtemplate.js");
const User = require("../model/Users.js");
const { oauth2client } = require("../util/googleConfig.js");

const SALT_VALUE = 12;

exports.signup = async (name, email, password, userRole) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error(`User already exists with ${email}`);
    }

    const hashedPassword = await hash(password, SALT_VALUE);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        userRole,
    });
    await newUser.save();

    welcomeMail(name, email);

    return { success: true, message: "Account created" };
};

exports.login = async (email, password) => {
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
        throw new Error(`User with ${email} doesn't exists.`);
    }

    if (!existingUser.password) {
        throw new Error("Try google login");
    }

    const result = await compare(password, existingUser.password);
    if (!result) {
        throw new Error("Incorrect username or password");
    }

    const token = jwt.sign(
        {
            id: existingUser.id,
        },
        process.env.TOKEN_SECRET,
        {
            expiresIn: "168hours",
        }
    );

    return { token };
};

exports.googleLogin = async (code) => {
    const googleResponse = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleResponse.tokens);

    const userRes = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`,
        {
            method: "GET",
        }
    );

    const { email, name, picture } = await userRes.json();

    let user = await User.findOne({ email });
    let token;

    if (!user) {
        const newUser = new User({
            email,
            name,
            profileUrl: picture,
            isGoogleAuth: true,
        });
        await newUser.save();

        token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT,
            }
        );
        return { token, isNewUser: true };
    } else {
        token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT,
            }
        );
        return { token, isNewUser: false };
    }
};

exports.forgotPassword = async (email) => {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        throw new Error(`User with ${email} doesn't exists.`);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const frontend =
        process.env.NODE_ENV === "production"
            ? process.env.FRONT_END_HOSTED
            : process.env.FRONT_END_LOCAL;

    const link = `${frontend}/auth/reset-password?email=${encodeURIComponent(
        email
    )}&token=${code}`;

    const mail = await forgotPasswordMail(email, link);

    if (mail.accepted.length > 0) {
        const hashedCode = createHmac("sha256", process.env.HMAC_CODE)
            .update(code)
            .digest("hex");
        existingUser.authCode = hashedCode;
        await existingUser.save();
        return { success: true };
    } else {
        throw new Error("Couldn't sent mail.");
    }
};

exports.validateToken = async (email, token) => {
    const existingUser = await User.findOne({ email }).select("+authCode");
    if (!existingUser) {
        throw new Error(`User with ${email} doesn't exists.`);
    }

    // Checking code validity
    if (new Date() - existingUser.updatedAt > 10 * 60 * 1000) {
        throw new Error("Token expired, retry.");
    }

    // checking token
    if (
        createHmac("sha256", process.env.HMAC_CODE)
            .update(token)
            .digest("hex") === existingUser.authCode
    ) {
        return { success: true };
    } else {
        throw new Error("Invalid token.");
    }
};

exports.resetPassword = async (email, password, token) => {
    const existingUser = await User.findOne({ email }).select(
        "+password +authCode"
    );
    if (!existingUser) {
        throw new Error(`User with ${email} doesn't exists.`);
    }

    // Revaidating token and removing it afterwards
    if (new Date() - existingUser.updatedAt > 10 * 60 * 1000) {
        throw new Error("Token expired, retry.");
    }

    // checking token
    if (
        createHmac("sha256", process.env.HMAC_CODE)
            .update(token)
            .digest("hex") === existingUser.authCode
    ) {
        existingUser.password = await hash(password, SALT_VALUE);
        existingUser.authCode = "";
        await existingUser.save();
        return { success: true };
    } else {
        throw new Error("Invalid token.");
    }
};