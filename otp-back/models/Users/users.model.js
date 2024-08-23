const fs = require("node:fs");
const db = require("../../database/db.json");

// find all users 
const findAll = () => db.users;

// find one user
const findOne = (userID) => {
    const users = [...db.users];
    const mainUser = users.find(user => user.id == userID);
    return mainUser;
};

// find one by id
const findOneByEmail = (userEmail) => {
    const mainUser = db.users.find(user => user.email === userEmail);
    if (mainUser) {
        return mainUser
    }
}

// insert one user
const insertOne = async (newUser) => {
    try {
        db.users.push(newUser);
        await fs.writeFileSync("database/db.json", JSON.stringify(db));
        return { status: 201, message: "User Create SuccessFully" };
    } catch (error) {
        return { status: 500, message: error.message };
    }
}

// delete one user 
const deleteOne = async (userID) => {
    try {
        const filteredUsers = [...db.users].filter(user => user.id != userID);
        db.users = filteredUsers
        await fs.writeFileSync("database/db.json", JSON.stringify(db));
        return { status: 200, message: "User Deleted SuccessFully" };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};

// update one user 
const updateOne = async (userID, newUserInfo) => {
    try {
        db.users.forEach(user => {
            // find main user
            if (user.id == userID) {
                // update main user info
                user.name = newUserInfo.name;
                user.email = newUserInfo.email;
            }
        });
        await fs.writeFileSync("database/db.json", JSON.stringify(db))
        return { status: 200, message: "User Updated SuccessFully" };
    } catch (error) {
        return { status: 500, message: error.message };
    }
};

// users model
const usersModel = { findAll, findOne, findOneByEmail, insertOne, deleteOne, updateOne };
module.exports = usersModel;