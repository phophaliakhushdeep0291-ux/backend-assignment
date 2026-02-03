import { Router } from "express";
import {  registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    verifyEmail,
    resendEmailVerification,
    resetPasswordWithOtp,
    forgotPassword,
    resendForgotPasswordOtp,
    getAllUsers, } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    registerUser
)
router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/verify-email/:token").get(verifyEmail)
router.route("/resend-verification").post(verifyJWT,resendEmailVerification)
router.route("/change-password").patch(verifyJWT,changeCurrentPassword)
router.route("/update-account").patch(verifyJWT,updateAccountDetail)
router.route("/me").get(verifyJWT,getCurrentUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").patch(resetPasswordWithOtp)
router.route("/resend-otp").post(resendForgotPasswordOtp)
router.route("/admin/all-users").get(verifyJWT, isAdmin, getAllUsers)

export default router