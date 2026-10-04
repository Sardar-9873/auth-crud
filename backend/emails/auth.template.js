const OnBoard = {
    subject: "Welcome Onboard! 🚀",
    text: "Your account has been registered succesfully in our application. Thanks for choosing us!"
};

const SignIn = {
    subject: "Welcome Back! 🚀",
    text: "Your account has been logged in succesfully in our application."
};

const ForgotPwd = {
    subject: "Password Reset Request - Your OTP Code 🔒",
    text: (otp) => {
        return `You requested a password reset. Your 6-digit OTP code is: ${otp}. This code is valid for 5 minutes. If you did not request this, please ignore this email or secure your account.`;
    }
};



const authEmailConstants = { OnBoard, SignIn, ForgotPwd };

module.exports = authEmailConstants;