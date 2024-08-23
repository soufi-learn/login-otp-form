const fs = require("node:fs");
const db = require("../../database/db.json");

// insert one otp 
const insertOne = async (newOtp) => {
    try {
        db.otp.push(newOtp);
        return await fs.writeFileSync("database/db.json", JSON.stringify(db));
    } catch (error) {
        return { status: 500, message: error.message };
    }
};

// find one otp 
const findOne = (phone, verifyCode) => {
    const mainOtp = db.otp.find(otp => otp.phone == phone && otp.verifyCode == verifyCode);
    return mainOtp
}

// otp module
const otpModel = { insertOne, findOne };
module.exports = otpModel;