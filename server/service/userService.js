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

class ServiceError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

exports.signup = async (name, email, password, userRole) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ServiceError(`User already exists with ${email}`, 400);
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
        throw new ServiceErrorError(`User with ${email} doesn't exists.`, 404);
    }

    if (!existingUser.password) {
        throw new ServiceError("Try google login", 400);
    }

    if (!existingUser.isActive) {
        throw new ServiceError("Your account has been banned. Please contact support", 401);
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
        throw new ServiceError("Account not verified, check mail", 403);
    }

    const result = await compare(password, existingUser.password);
    if (!result) {
        throw new ServiceError("Incorrect username or password", 400);
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
            throw new ServiceError("Your account has been banned. Please contact support.", 401);
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
        throw new ServiceError(`User with ${email} doesn't exists.`, 404);
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
        throw new ServiceError("Couldn't sent mail.", 500);
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
        throw new ServiceError("Invalid token.", 400);
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
        throw new ServiceError(`User with ${email} doesn't exists.`, 404);
    }

    // Revalidating token and removing it afterwards
    if (new Date() - existingUser.updatedAt > 10 * 60 * 1000) {
        throw new ServiceError("Token expired, retry.", 401);
    }

    // checking token
    const isMatch = await compare(token, existingUser.authCode);
    if (isMatch) {
        existingUser.password = await hash(password, SALT_VALUE);
        existingUser.authCode = "";
        await existingUser.save();
        return { success: true };
    } else {
        throw new ServiceError("Invalid token.", 401);
    }
};

exports.updateUser = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select("+password");
    if (!user) {
        throw new ServiceError("User not found", 404);
    }

    if (user.isGoogleAuth && !user.password) {
        // TODO: Instead let user set the password directly
        throw new ServiceError("Google accounts do not have passwords. Use Google login.", 403);
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ServiceError("Incorrect current password", 400);
    }

    const hashedPassword = await hash(newPassword, SALT_VALUE);
    user.password = hashedPassword;
    await user.save();

    return { success: true };
};

exports.verifyEmail = async (email, token) => {

    const existingUser = await User.findOne({ email: email }).select("+authCode");
    if (!existingUser) {
        throw new ServiceError("User not found", 404);
    } else if (existingUser.isEmailVerified) {
        throw new ServiceError("Email already verified", 400);
    }

    //comparing result
    const isMatch = await compare(token, existingUser.authCode);
    if (!isMatch) {
        throw new ServiceError("Incorrect token", 401);
    } else if (existingUser.updatedAt < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedCode = await hash(code, SALT_VALUE);
        existingUser.authCode = hashedCode;
        await existingUser.save();
        throw new ServiceError("Token expired, new mail sent", 401);
    }

    existingUser.isEmailVerified = true;
    await existingUser.save();

    return;
}
