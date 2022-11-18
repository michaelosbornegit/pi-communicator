import {
    Body,
    Controller,
    Get,
    Header,
    Middlewares,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
import bodyParser from "body-parser";
import { User } from "../Types/user";
import { RegistrationService } from "../Services/registration";
import { ApiError } from "../ApiError";
import { Registration } from "../Types/registration";
  
  @Route("registration")
  @Middlewares(bodyParser.urlencoded({ extended: true }), bodyParser.json())
  export class RegistrationController extends Controller {
    @Post("/")
    public async register(@Header() deviceId: string): Promise<User['id']> {
      const registration = await new RegistrationService().findOrCreateRegistration(deviceId);
        
      if (!registration) {
        throw new ApiError('Device not registered to user', 404);
      } else {
        return registration;
      }
    }

    @Get("/")
    public async getRegistrations(): Promise<Registration[]> {
      return await new RegistrationService().findAllRegistrations();
    }

    @Post("/register")
    public async updateRegistration(@Body() registration: Registration): Promise<void> {
      return await new RegistrationService().updateRegistration(registration);
    }
}