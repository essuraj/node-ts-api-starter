import { Server } from "restify";
import AuthController from "../controllers/auth.controller";
import { processRoutes } from "./processRoutes";
export default function routeDefinition(server: Server): void {
  const controllers = [AuthController];
  processRoutes(server, controllers);
}
