const otpController = require("../../controllers/Otp/otp.controller");
const otpRoutesOptions = require("../../routes-options/otp/otp.option");

// otp routes
const otpRoutes = (app, options, done) => {
    // send opt code
    app.post("/send", otpRoutesOptions.sendOtpOptions, otpController.sendCode);

    // verify otp code
    app.post("/verify", otpRoutesOptions.verifyOtpOptions, otpController.verifyCode);

    // next()
    return done();
};

module.exports = otpRoutes;