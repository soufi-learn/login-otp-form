const userSchema = {
    $id: "userSchema",
    type: "object",
    properties: {
        id: { type: "string" },
        username: { type: "string" },
        email: { type: "string" },
        password: { type: "string" }
    }
};


module.exports = { userSchema }