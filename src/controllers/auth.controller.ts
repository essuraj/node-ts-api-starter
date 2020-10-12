import { Request, Response, Next } from "restify";
import BaseController from "../policies/base_controller";
import { Controller } from "../policies/decorators/controller";
import { HTTP_METHODS, Route } from "../policies/decorators/router";

@Controller("/users")
export default class AuthController extends BaseController {
  constructor() {
    super();
  }

  @Route(HTTP_METHODS.GET)
  public async authUser(req: Request, res: Response): Promise<any> {
    try {
      return res.send("hello there - " + (req.query.name ? req.query.name : ""));
    } catch (error) {
      // this.ErrorResult(error, req, res, next);
    }
  }
}
