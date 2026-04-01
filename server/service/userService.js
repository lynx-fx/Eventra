const jwt = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const { welcomeMail, forgotPasswordMail, verifyEmailMail } = require("../util/mailtemplate.js");
const User = require("../model/Users.js");
const { oauth2client } = require("../util/googleConfig.js");

const SALT_VALUE = 12;

const frontend =
    process.env.NODE_ENV === "production"
        ? process.env.FRONT_END_HOSTED
        : process.env.FRONT_END_LOCAL;

exports.signup = async (name, email, password, userRole) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error(`User already exists with ${email}`);
    }

    const hashedPassword = await hash(password, SALT_VALUE);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await hash(code, SALT_VALUE);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: userRole,
        authCode: hashedCode,
    });
    await newUser.save();

    const link = `${frontend}/auth/verify?email=${email}&token=${code}`;
    await welcomeMail(name, email, link);

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

    if (!existingUser.isActive) {
        throw new Error("Your account has been banned. Please contact support");
    }

    if (!existingUser.isEmailVerified) {
        // update the otp
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = await hash(code, SALT_VALUE);
        existingUser.authCode = hashedCode;
        await existingUser.save();

        const link = `${frontend}/auth/verify?email=${email}&token=${code}`

        // send mail
        verifyEmailMail(existingUser.name, existingUser.email, link);
        throw new Error("Account not verified, check mail");
    }

    const result = await compare(password, existingUser.password);
    if (!result) {
        throw new Error("Incorrect username or password");
    }

    const token = jwt.sign(
        {
            id: existingUser.id,
            role: existingUser.role,
        },
        process.env.JWT_SECRET,
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
            isEmailVerified: true,
        });
        await newUser.save();

        token = jwt.sign(
            {
                id: newUser._id,
                role: newUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_TIMEOUT,
            }
        );
        return { token, isNewUser: true };
    } else {
        if (!user.isActive) {
            throw new Error("Your account has been banned. Please contact support.");
        }

        // If user exists but has no profileUrl, update it with google picture
        if (!user.profileUrl && picture) {
            user.profileUrl = picture;
        }

        // Ensure isGoogleAuth is set
        if (!user.isGoogleAuth) {
            user.isGoogleAuth = true;
        }

        if (user.isModified()) {
            await user.save();
        }

        token = jwt.sign(
            {
                id: user._id,
                role: user.role,
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


    const link = `${frontend}/auth/reset-password?email=${encodeURIComponent(
        email
    )}&token=${code}`;

    const mail = await forgotPasswordMail(email, link);

    if (mail.accepted.length > 0) {
        const hashedCode = await hash(code, SALT_VALUE);
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
    const isMatch = await compare(token, existingUser.authCode);
    if (isMatch) {
        return { success: true };
    } else {
        throw new Error("Invalid token.");
    }
};

exports.getUserById = async (userId) => {
    return await User.findById(userId);
};

exports.resetPassword = async (email, password, token) => {
    const existingUser = await User.findOne({ email }).select(
        "+password +authCode"
    );
    if (!existingUser) {
        throw new Error(`User with ${email} doesn't exists.`);
    }

    // Revalidating token and removing it afterwards
    if (new Date() - existingUser.updatedAt > 10 * 60 * 1000) {
        throw new Error("Token expired, retry.");
    }

    // checking token
    const isMatch = await compare(token, existingUser.authCode);
    if (isMatch) {
        existingUser.password = await hash(password, SALT_VALUE);
        existingUser.authCode = "";
        await existingUser.save();
        return { success: true };
    } else {
        throw new Error("Invalid token.");
    }
};

exports.updateUser = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select("+password");
    if (!user) {
        throw new Error("User not found");
    }

    if (user.isGoogleAuth && !user.password) {
        throw new Error("Google accounts do not have passwords. Use Google login.");
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
        throw new Error("Incorrect current password");
    }

    const hashedPassword = await hash(newPassword, SALT_VALUE);
    user.password = hashedPassword;
    await user.save();

    return { success: true };
};

exports.verifyEmail = async (email, token) => {

    const existingUser = await User.findOne({ email: email }).select("+authCode");
    if (!existingUser) {
        throw new Error("User not found");
    } else if (existingUser.isEmailVerified) {
        throw new Error("Email already verified");
    }

    //comparing result
    const isMatch = await compare(token, existingUser.authCode);
    if (!isMatch) {
        throw new Error("Incorrect token");
    } else if (existingUser.updatedAt < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = await hash(code, SALT_VALUE);
        existingUser.authCode = hashedCode;
        await existingUser.save();
        throw new Error("Token expired, new mail sent");
    }

    existingUser.isEmailVerified = true;
    await existingUser.save();

    return;
}
