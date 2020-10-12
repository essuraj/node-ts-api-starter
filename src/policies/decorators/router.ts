export enum HTTP_METHODS {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PATCH = "patch",
  OPTIONS = "options",
  PUT = "put",
}

export interface RouteDefinition {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: HTTP_METHODS;
  // Method name within our class responsible for this route
  methodName: string;
  // authentication
  isAuthenticated: boolean;
}

/**
 * lets you declare a route for http calls
 *
 * @param {HTTP_METHODS} method Http method by restify
 * @param {string} [path=""] url path, can be :param or path
 * @param {boolean} [isAuthorized=false] decide if the routes are restricted and are accessible only via jwt token
 * @return {*}  {MethodDecorator}
 */
export const Route = (method: HTTP_METHODS, path: string = "", isAuthorized = false): MethodDecorator => {
  // `target` equals our class, `propertyKey` equals our decorated method name
  return (target, propertyKey: string): void => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    Reflect.defineMetadata("isAuthorizedMethod", isAuthorized, target);
    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata("routes", target.constructor) as Array<RouteDefinition>;

    routes.push({
      requestMethod: method,
      path,
      methodName: propertyKey,
      isAuthenticated: isAuthorized,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
