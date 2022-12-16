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
import { RegistrationService } from "../Services/registration";
import { ApiError } from "../ApiError";
import { Registration } from "../Types/registration";
import md5 from 'md5';
import { validDeviceHashes } from "../validDevices";
  
  @Route("registration")
  @Middlewares(bodyParser.urlencoded({ extended: true }), bodyParser.json())
  export class RegistrationController extends Controller {
    @Post("/")
    public async register(@Header() deviceId: string): Promise<Registration['username']> {
      const hashedDeviceId = md5(deviceId);
      if (!validDeviceHashes.includes(hashedDeviceId)) {
        throw new ApiError('DeviceId not valid', 403);
      }

      const registration = await new RegistrationService().findOrCreateRegistration(hashedDeviceId);
        
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
      registration.deviceId = md5(registration.deviceId);
      return await new RegistrationService().updateRegistration(registration);
    }
}