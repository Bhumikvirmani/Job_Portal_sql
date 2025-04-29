import serverless from "serverless-http";
import app from "../index.js";

const handlerfunction = (req, res) => {
    return app(req, res);
};

export const handler = serverless(handlerfunction);
