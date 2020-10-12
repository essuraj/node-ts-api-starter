// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();
import { createServer, plugins } from "restify";
import { logger } from "./policies/init_app";
import "reflect-metadata";
import routeDefinition from "./routes";
import corsMiddleware = require("restify-cors-middleware");

logger.debug("✔ Logger initialized");

const server = createServer();
server.use(plugins.dateParser());
server.use(plugins.queryParser());
server.use(plugins.bodyParser());
// server.server.setTimeout(60000 * 0.5);

const cors = corsMiddleware({
  origins: ["*"],
  allowHeaders: ["at"],
  exposeHeaders: [],
});

server.pre(cors.preflight);
server.use(cors.actual);

server.pre((req, _, next) => {
  logger.debug(req.method, req.url, " => ", req.headers["host"]);
  next();
});

routeDefinition(server);

server.listen(process.env.PORT, function() {
  logger.info("=---------------------------------------------------=");
  logger.info("env -> ", process.env.NODE_CONFIG_ENV);
  logger.info("=---------------------------------------------------=");
  logger.info("API HOSTED ON => http://localhost:%s", process.env.PORT);
  logger.info("=---------------------------------------------------=");
});
