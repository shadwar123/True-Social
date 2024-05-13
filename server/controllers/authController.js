const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password || !name) {
            // return res.status(400).send("All fields are required");
            return res.send(error(400, "All fields are required"));
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            // return res.status(409).send("User is already registered");
            return res.send(error(409, "User is already registered"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.send(
            success(201, 'user created successfully')
        );
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).send("All fields are required");
            return res.send(error(400, "All fields are required"));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            // return res.status(404).send("User is not registered");
            return res.send(error(404, "User is not registered"));
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            // return res.status(403).send("Incorrect password");
            return res.send(error(403, "ncorrect password"));
        }

        const accessToken = generateAccessToken({
            _id: user._id,
        });
        const refreshToken = generateRefreshToken({
            _id: user._id,
        });

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return res.send(success(200, { accessToken }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

// this api will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.jwt) {
        // return res.status(401).send("Refresh token in cookie is required");
        return res.send(error(401, "Refresh token in cookie is required"));
    }

    const refreshToken = cookies.jwt;

    console.log('refressh', refreshToken);

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY
        );

        const _id = decoded._id;
        const accessToken = generateAccessToken({ _id });

        return res.send(success(201, { accessToken }));
    } catch (e) {
        console.log(e);
        // return res.status(401).send("Invalid refresh token");
        return res.send(error(401, "Invalid refresh token"));
    }
};

const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
        })
        return res.send(success(200, 'user logged out'))
    } catch (e) {
        return res.send(error(500, e.message));
    }
}

//internal functions
const generateAccessToken = (data) => {
    console.log('access token generated')
    try {
        const token = jwt.sign(data, 'e88f27478505704c9ea33bf34f8f55de30e875b015a1b92925862b7af6f5a6513069a2a48c144d3983502fed987c5ad622cae3f1b8e89e201b79361b9f156b55', {
            expiresIn: "1d",
        });
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
};

const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, 'e91db63d5eb386f45e8711e0d37b2c248e5685d1a86ccaa00a377c39ee2c140fde900783dbe3c502674d256a14e9bd4d54816b4a099f99d5026a67493f5d3092', {
            expiresIn: "1y",
        });
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signupController,
    loginController,
    refreshAccessTokenController,
    logoutController
};
