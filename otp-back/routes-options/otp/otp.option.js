// send otp options
const sendOtpOptions = {
  schema: {
    description: "Send OTP Code",
    tags: ["OTP"],
    summary: "send otp code route",
    body: {
      type: "object",
      required: ["phone"],
      properties: {
        phone: {
          type: "string",
          pattern:
            "^(0|98)?([ ]|-|[()]){0,2}9[0-4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$",
          errorMessage: {
            pattern: "Phone Number Not Valid",
          },
        },
      },
      examples: [{ phone: "09109336202" }],
    },
    response: {
      201: {
        type: "object",
        properties: {
          url: { type: "string" },
          message: { type: "string" },
          verifyCode: { type: "string" },
          status: { type: "integer" },
        },
        examples: [
          {
            url: "/otp/send",
            message: "Otp Code Send Successfully",
            verifyCode: "111111",
            status: 201,
          },
        ],
      },
      400: {
        $ref: "responseSchema#",
        examples: [
          { url: "/otp/send", message: "Phone Number Not Valid", status: 400 },
          {
            url: "/otp/send",
            message: "Phone Number Require Felid",
            status: 400,
          },
        ],
      },
      500: {
        $ref: "responseSchema#",
        examples: [
          { url: "/otp/send", message: "Internal Server Error", status: 500 },
        ],
      },
    },
  },
  errorHandler(error, req, res) {
    return res.code(error.statusCode).send({
      url: req.originalUrl,
      message: error.message,
      status: error.statusCode,
    });
  },
};

// verify otp options
const verifyOtpOptions = {
  schema: {
    description: "Verify OTP Code",
    tags: ["OTP"],
    summary: "verify otp code route",

    body: {
      type: "object",
      required: ["phone", "verifyCode"],
      properties: {
        phone: {
          type: "string",
          pattern:
            "^(0|98)?([ ]|-|[()]){0,2}9[0-4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$",
          errorMessage: {
            pattern: "Phone Number Not Valid",
          },
        },
        verifyCode: { type: "string", maxLength: 6 },
      },
      examples: [{ phone: "09109336202", verifyCode: "111111" }],
    },
    response: {
      200: {
        $ref: "responseSchema#",
        examples: [
          {
            url: "/otp/verify",
            message: "Phone Number Verify Successfully",
            status: 200,
          },
        ],
      },
      400: {
        type: "object",
        properties: {
          url: { type: "string" },
          message: { type: "string" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                phone: { type: "string" },
                verifyCode: { type: "string" },
              },
            },
          },
          status: { type: "integer" },
        },
        examples: [
          {
            url: "/otp/verify",
            message: "Bad Request",
            errors: {
              phone: "Phone Number Not Valid",
              verifyCode: "VerifyCode Required",
            },
            status: 400,
          },
        ],
      },
      409: {
        $ref: "responseSchema#",
        examples: [
          {
            url: "/otp/verify",
            message: "Otp Code Is Not Correct",
            status: 409,
          },
        ],
      },
      410: {
        $ref: "responseSchema#",
        examples: [
          { url: "/otp/verify", message: "Otp Code Expired", status: 410 },
        ],
      },
      500: {
        $ref: "responseSchema#",
        examples: [
          { url: "/otp/verify", message: "Internal Server Error", status: 500 },
        ],
      },
    },
  },
  errorHandler(error, req, rep) {
    const { statusCode: status } = error;
    // validation errors
    const errors = error.validation?.map((error) => {
      const message = error.message;
      let input;
      if (error.instancePath) {
        input = error.instancePath.split("/")[1];
      } else {
        input = error.params?.missingProperty;
      }
      return { [input]: message };
    });
    return rep
      .code(status)
      .send({ url: req.originalUrl, message: "Bad Request", errors, status });
  },
};
// export otpOptions
const otpRoutesOptions = { sendOtpOptions, verifyOtpOptions };
module.exports = otpRoutesOptions;
