/**
 *
 *Adds a controller route
 * @param {string} urlPrefix url prefix
 * @param {boolean} [isAuthorized=false] decide if the routes are restricted and are accessible only via jwt token
 * @return {*}  {ClassDecorator}
 */
export const Controller = (prefix: string, isAuthorized = false): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata("prefix", prefix, target);
    Reflect.defineMetadata("isAuthorizedClass", isAuthorized, target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
};
