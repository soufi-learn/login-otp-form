const responseSchema = {
    $id: "responseSchema",
    type: "object",
    properties: {
        url: { type: "string" },
        message: { type: "string" },
        status: { type: "integer" }
    }
};

module.exports = { responseSchema }