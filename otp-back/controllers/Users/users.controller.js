const usersModel = require("../../models/Users/users.model")
const crypto = require("node:crypto");

// get all users
const getAllUsers = (req, rep) => {
    const users = usersModel.findAll();
    return rep.send({ url: req.originalUrl, users, status: 200 });
};

// get one user 
const getOneUser = (req, rep) => {
    const userID = req.params.id;
    const mainUser = usersModel.findOne(userID);
    if (mainUser) {
        return rep.send({ url: req.originalUrl, user: mainUser, status: 200 });
    } else {
        return rep.code(404).send({ url: req.originalUrl, message: "User Not Found", status: 404 });
    }
}

// create new user
const createNewUser = async (req, rep) => {
    try {
        const { username, email, password } = req.body;
        const isUserExistBefore = usersModel.findOneByEmail(email);
        if (isUserExistBefore) {
            return rep
                .code(409)
                .send({ url: req.originalUrl, message: "User Exist Before", status: 409 })
        }
        const newUser = { id: crypto.randomUUID(), username, email, password };
        const { status, message } = await usersModel.insertOne(newUser);
        return rep.code(status).send({ url: req.originalUrl, message, status });
    } catch (error) {
        const { status, message } = typeof error === "string" ? { status: 500, message: "Internal Server Error" } : error;
        return rep.code(status).send({ url: req.originalUrl, message, status });
    }
};

// delete one user
const deleteOneUser = async (req, rep) => {
    try {
        const userID = req.params.id;
        const isUserExist = usersModel.findOne(userID);
        if (!isUserExist) {
            return rep.code(404).send({ url: req.originalUrl, message: "User Not Found", status: 404 });
        }
        const { status, message } = await usersModel.deleteOne(userID);
        return rep.code(status).send({ url: req.originalUrl, message, status });
    } catch (error) {
        const { status, message } = typeof error === "string" ? { status: 500, message: "Internal Server Error" } : error;
        return rep.code(status).send({ url: req.originalUrl, message, status });
    }
};

// update one user
const updateOneUser = async (req, rep) => {
    try {
        const userID = req.params.id;
        const newUserInfo = req.body;
        const isUserExist = usersModel.findOne(userID);
        if (!isUserExist) {
            return rep
                .code(404)
                .send({ url: req.originalUrl, message: "User Not Found", status: 404 });
        }
        const { status, message } = await usersModel.updateOne(userID, newUserInfo);
        return rep.code(status).send({ url: req.originalUrl, message, status });
    } catch (error) {
        const { status, message } = typeof error === "string" ? { status: 500, message: "Internal Server Error" } : error;
        return rep.code(status).send({ url: req.originalUrl, message, status });
    }
};


// users controller
const usersController = { getAllUsers, getOneUser, createNewUser, deleteOneUser, updateOneUser };
module.exports = usersController;