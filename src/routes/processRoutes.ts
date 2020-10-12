import { RouteDefinition } from "../policies/decorators/router";
import { IsAuthenticated } from "../policies/authorizer";
import { Server, Request, Response, Next } from "restify";

export const processRoutes = (server: Server, controllers: any[]): void => {
  server.get("/", (_, res) => {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
    });
    res.write("<h1 style='font-family:monospace;text-align:center;font-size:72px'><br/><br/><br/>🚀<br/>API is Ready! </h1>");
    return res.end();
  });

  controllers.forEach((controller) => {
    // This is our instantiated class
    const instance = new controller();
    // The prefix saved to our controller
    const prefix = Reflect.getMetadata("prefix", controller);
    const isAuthorizedClass = Reflect.getMetadata("isAuthorizedClass", controller) as boolean;

    // Our `routes` array containing all our routes for this controller
    const routes: Array<RouteDefinition> = Reflect.getMetadata("routes", controller);

    // Iterate over all routes and register them to our express application
    routes.forEach((route) => {
      // It would be a good idea at this point to substitute the `app[route.requestMethod]` with a `switch/case` statement
      // since we can't be sure about the availability of methods on our `app` object. But for the sake of simplicity
      // this should be enough for now.
      const authMiddlewareDecision =
        isAuthorizedClass === true
          ? IsAuthenticated
          : route.isAuthenticated
          ? IsAuthenticated
          : (_req: Request, _res: Response, next: Next) => {
              next();
            };
      server[route.requestMethod](prefix + route.path, authMiddlewareDecision, (req: Request, res: Response) => {
        // Execute our method for this path and pass our express request and response object.
        instance[route.methodName](req, res);
      });
    });
  });
};
