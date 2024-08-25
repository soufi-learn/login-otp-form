require("dotenv").config();
const Fastify = require("fastify");
const usersRoutes = require("./routes/users/users.route");
const { userSchema } = require("./schemas/user/user.schema");
const { responseSchema } = require("./schemas/response/response.schema");
const otpRoutes = require("./routes/otp/otp.route");
const port = process.env.PORT || 5000;

(async () => {

    // app configs
    const app = Fastify({
        logger: false,
        ajv: {
            customOptions: {
                allErrors: true,
            },
            plugins: [require("ajv-errors")],
        },
    });


    /* app schemas start */

    app.addSchema(userSchema);
    app.addSchema(responseSchema);

    /* app schemas end */


    /* app plugins start */

    // CORS plugin
    await app.register(require("@fastify/middie"));
    app.use(require("cors")())

    // @fastify/swagger plugin
    app.register(require("@fastify/swagger"), {
        openapi: {
            info: {
                title: "Fastify API",
                description: "Soheil the Fastify swagger API",
                version: "1.0.0",
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                    description: "Development server",
                },
            ],
            tags: [
                { name: "Users", description: "Users API Routes" },
                { name: "OTP", description: "OTP API Routes" }
            ],
        },
    });

    // @fastify/swagger-ui plugin
    app.register(require("@fastify/swagger-ui"), {
        routePrefix: "/api-document",
        uiConfig: {},
    });
    /* app plugins end */


    /* app middlewares start */

    // error handler 
    app.setErrorHandler((error, req, res) => {
        return res
            .code(error.statusCode)
            .send({ url: req.originalUrl, message: error.message, status: error.statusCode });
    });

    // app level logger middleware
    app.addHook("preHandler", (req, rep, done,) => {
        console.log("app logger middleware => ", {
            method: req.method,
            url: req.originalUrl,
            query: req.query || {},
            params: req.params,
            body: req.body || {},
        });
        return done();
    });

    /* app middlewares end */


    /* app routes start */

    app.register(usersRoutes, { prefix: "/users" });
    app.register(otpRoutes, { prefix: "/otp" });
    /* app routes end */

    // welcome route
    app.get("/", (req, rep) => rep.send({ url: req.originalUrl, message: "Welcome To API Routes", status: 200 }));

    // not found routes 404
    app.all("*", (req, rep) => rep.code(404).send({ url: req.originalUrl, message: "Route Not Found", status: 404 }));

    // web-server configs
    app.listen({ port }, (error) => {
        if (error) {
            throw console.log(error.message);
        };
        console.log(`server run port ${port}`);
    });

})();