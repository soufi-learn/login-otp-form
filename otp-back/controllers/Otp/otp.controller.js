const otpModel = require("../../models/Otp/otp.model");

// send code
const sendCode = async (req, rep) => {
  try {
    const { phone } = req.body;
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // five random number
    const expireTime = new Date().getTime() + 1000 * 60 * 2.5; // expire after 2.5 min
    const newOtp = { phone, verifyCode: randomNumber, expireTime };
    console.log("<=% USER OTP  %=>", newOtp);
    await otpModel.insertOne(newOtp);
    return rep.code(201).send({
      url: req.originalUrl,
      message: "Otp Code Send Successfully",
      verifyCode: String(randomNumber),
      status: 201,
    });
  } catch (error) {
    const { status, message } =
      typeof error === "string"
        ? { status: 500, message: "Internal Server Error" }
        : error;
    return rep.code(status).send({ url: req.originalUrl, message, status });
  }
};

// verify code
const verifyCode = (req, rep) => {
  const { phone, verifyCode: code } = req.body;
  const mainOtp = otpModel.findOne(phone, code);

  if (!mainOtp) {
    return rep.code(409).send({
      url: req.originalUrl,
      message: "Otp Code Is Not Correct",
      status: 409,
    });
  }

  // check otp expired time
  const now = new Date().getTime();
  if (mainOtp.expireTime > now) {
    return rep.send({
      url: req.originalUrl,
      message: "Phone Number Verify Successfully",
      status: 200,
    });
  } else {
    return rep
      .code(410)
      .send({ url: req.originalUrl, message: "Otp Code Expired", status: 410 });
  }
};

const otpController = { sendCode, verifyCode };
module.exports = otpController;
