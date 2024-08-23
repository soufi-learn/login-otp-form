const usersController = require("../../controllers/Users/users.controller");
const usersRoutesOptions = require("../../routes-options/users/users.option");

// users routes
const usersRoutes = (app, options, done) => {

    // get all users route
    app.get("/", usersRoutesOptions.getAllUsersOptions, usersController.getAllUsers);

    // create one user route
    app.post("/", usersRoutesOptions.createOneUserOptions, usersController.createNewUser);

    // get one user route
    app.get("/:id", usersRoutesOptions.getOneUserOptions, usersController.getOneUser);

    // update one user route
    app.put("/:id", usersRoutesOptions.updateOneUserOptions, usersController.updateOneUser);

    // delete one user route 
    app.delete("/:id", usersRoutesOptions.deleteOneUserOptions, usersController.deleteOneUser);

    // next(); 
    return done();
};

// export users routes 
module.exports = usersRoutes;