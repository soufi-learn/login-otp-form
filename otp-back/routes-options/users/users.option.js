// get all user
const getAllUsersOptions = {
    schema: {
        description: "Get All Users",
        tags: ["Users"],
        summary: "get all users route",
        response: {
            200: {
                type: "object",
                properties: {
                    url: { type: "string" },
                    users: { type: "array", items: { $ref: "userSchema#" } },
                    status: { type: "integer" }
                },
                examples: [{ url: "/users", users: [{ id: "591ec00e-fbe0-4d3c-b43f-f728c3472368", username: "soheil", password: "soheil-1382", email: "soheil@gmail.com" }], status: 200 }]
            },
            500: {
                $ref: "responseSchema#",
                examples: [{ url: "/users", message: "Internal Server Error", status: 500 }]
            }
        }
    }
};

// get one user 
const getOneUserOptions = {
    schema: {
        description: "Get One User",
        tags: ["Users"],
        summary: "get one user route",
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    description: "send the id of the user you want get",
                    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
                    examples: ["591ec00e-fbe0-4d3c-b43f-f728c3472368"],
                    errorMessage: {
                        pattern: "params/id not be valid"
                    }
                }
            }
        },
        response: {
            200: {
                type: "object",
                properties: {
                    url: { type: "string" },
                    user: { $ref: "userSchema" },
                    status: { type: "integer" }
                },
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", user: { id: "591ec00e-fbe0-4d3c-b43f-f728c3472368", username: "soheil", password: "soheil-1382", email: "soheil@gmail.com" }, status: 200 }]
            },
            400: {
                type: "object",
                properties: {
                    url: { type: "string" },
                    message: { type: "string" },
                    error: { type: "string" },
                    status: { type: "integer" },
                },
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "Bad Request", error: "params/id not be valid", status: 400 }]
            },
            404: {
                $ref: "responseSchema#",
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "User Not Found", status: 404 }]
            },
            500: {
                $ref: "responseSchema#",
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "Internal Server Error", status: 500 }]
            },
        }
    },
    errorHandler(error, req, rep) {
        const { statusCode: status, message: errorMessage } = error;
        return rep
            .code(status)
            .send({ url: req.originalUrl, message: "Bad Request", error: errorMessage, status });
    }
};

// create one user
const createOneUserOptions = {
    schema: {
        description: "Create One User",
        tags: ["Users"],
        summary: "create one user route",
        body: {
            required: ["username", "email", "password"],
            type: "object",
            properties: {
                username: {
                    type: "string",
                    pattern: "^[0-9A-Za-z]{4,12}$",
                    errorMessage: {
                        pattern: "username not valid",
                    },
                },
                email: {
                    type: "string",
                    pattern: "^[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+$",
                    errorMessage: {
                        pattern: "email not valid",
                    },
                },
                password: {
                    type: "string",
                    pattern: "^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,12}$",
                    errorMessage: {
                        pattern: "password not valid",
                    },
                }
            },
            examples: [{ username: "soheil", password: "soheil-1382", email: "soheil@gmail.com" }]
        },
        response: {
            200: {
                $ref: "responseSchema#",
                examples: [{ url: "/users", message: "User Created Successfully", status: 200 }]
            },
            400: {
                type: "object",
                properties: {
                    url: { type: "string" },
                    message: { type: "string" },
                    errors: {
                        type: "array", items: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                email: { type: "string" },
                                password: { type: "string" }
                            }
                        }
                    },
                    status: { type: "integer" }
                },
                examples: [{
                    url: "/users",
                    message: "Bad Request",
                    errors: {
                        name: "must have required property 'name'",
                        email: "email not valid"
                    },
                    status: 400
                }]
            },
            409: {
                $ref: "responseSchema#",
                examples: [{ url: "/users", message: "User Exist Before", status: 409 }]
            },
            500: {
                $ref: "responseSchema#",
                examples: [{ url: "/users", message: "Internal Server Error", status: 500 }]
            },
        }
    },
    errorHandler(error, req, rep) {
        const { statusCode: status } = error;
        console.log("error => ", error);
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
    }
};

// delete one user
const deleteOneUserOptions = {
    schema: {
        description: "Delete One User",
        tags: ["Users"],
        summary: "delete one user route",
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    description: "send the id of the user you want delete",
                    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
                    examples: ["591ec00e-fbe0-4d3c-b43f-f728c3472368"],
                    errorMessage: {
                        pattern: "params/id not be valid"
                    }
                }
            }
        },
        response: {
            200: {
                $ref: "responseSchema#",
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "User Deleted Successfully", status: 200 }]
            },
            400: {
                type: "object",
                properties: {
                    url: { type: "string" },
                    message: { type: "string" },
                    error: { type: "string" },
                    status: { type: "integer" },
                },
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "Bad Request", error: "params/id not be valid", status: 400 }]
            },
            404: {
                $ref: "responseSchema#",
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "User Not Found", status: 404 }]
            },
            500: {
                $ref: "responseSchema#",
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "Internal Server Error", status: 500 }]
            },
        }
    },
    errorHandler(error, req, rep) {
        const { statusCode: status, message: errorMessage } = error;
        return rep
            .code(status)
            .send({ url: req.originalUrl, message: "Bad Request", error: errorMessage, status });
    }
};

// update one user
const updateOneUserOptions = {
    schema: {
        description: "Update One User",
        tags: ["Users"],
        summary: "update one user route",
        params: {
            type: "object",
            properties: {
                id: {
                    type: "string",
                    description: "send the id of the user you want delete",
                    pattern: "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
                    examples: ["591ec00e-fbe0-4d3c-b43f-f728c3472368"],
                    errorMessage: {
                        pattern: "params/id not be valid"
                    }
                }
            }
        },
        body: {
            required: ["username", "email", "password"],
            type: "object",
            properties: {
                username: {
                    type: "string",
                    pattern: "^[0-9A-Za-z]{4,12}$",
                    errorMessage: {
                        pattern: "username not valid",
                    },
                },
                email: {
                    type: "string",
                    pattern: "^[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+$",
                    errorMessage: {
                        pattern: "email not valid",
                    },
                },
                password: {
                    type: "string",
                    pattern: "^[0-9A-Za-z]{4,12}$",
                    errorMessage: {
                        pattern: "password not valid",
                    },
                }
            },
            examples: [{ name: "soheil", email: "soheil@gmail.com" }]
        },
        response: {
            200: {
                $ref: "responseSchema#",
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "User Updated Successfully", status: 200 }]
            },
            400: {
                type: "object",
                properties: {
                    url: { type: "string" },
                    message: { type: "string" },
                    error: { type: "string" },
                    errors: {
                        type: "array", items: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                email: { type: "string" }
                            }
                        }
                    },
                    status: { type: "integer" },
                },
                examples: [
                    { url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "Bad Request", error: "params/id not be valid", status: 400 },
                    { url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "Bad Request", errors: { name: "name not valid", email: "email required" }, status: 400 },
                ]
            },
            404: {
                $ref: "responseSchema#",
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "User Not Found", status: 404 }]
            },
            500: {
                $ref: "responseSchema#",
                examples: [{ url: "/users/591ec00e-fbe0-4d3c-b43f-f728c3472368", message: "Internal Server Error", status: 500 }]
            },
        }
    },
    errorHandler(error, req, rep) {
        const { statusCode: status, validationContext } = error;
        console.log("error => ", error);
        if (validationContext === "params") {
            const errorMessage = error.validation[0].message
            return rep
                .code(status)
                .send({ url: req.originalUrl, message: "Bad Request", error: errorMessage, status });
        } else if (validationContext === "body") {
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
        } else {
            return rep
                .code(500)
                .send({ url: req.originalUrl, message: "Internal Server Error", status: 500 });
        }
    }
};

// export users routes options 
const usersRoutesOptions = { getAllUsersOptions, getOneUserOptions, createOneUserOptions, deleteOneUserOptions, updateOneUserOptions };
module.exports = usersRoutesOptions