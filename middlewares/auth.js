import jwt from "jsonwebtoken";
import { Users } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Login first"
        });
    }


    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Users.findById(decodedData._id);

    next();
};
