import serverless from "serverless-http";
import app, { initializeDatabaseTables } from "../index.js";

let initialized = false;

const handlerFunction = async (req, res) => {
    if (!initialized) {
        await initializeDatabaseTables();
        initialized = true;
    }
    return app(req, res);
};

export const handler = serverless(handlerFunction);