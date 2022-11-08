// src/users/usersController.ts
import {
    Body,
    Controller,
    Get,
    Middlewares,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
  import type { ChromeSessionBody, DisplaySession, Message, MessageBody, Session, SessionBody } from "../Types/message";
  import { MessageService } from "../Services/message";
import bodyParser from "body-parser";
import { HostMachines } from "../Types/enums";
  
  @Route("messages")
  @Middlewares(bodyParser.urlencoded({ extended: true }), bodyParser.json())
  export class MessageController extends Controller {
    @Post("/send")
    @SuccessResponse('201', 'Message Sent!')
    public async sendMessage(@Body() body: MessageBody): Promise<void> {
      return await new MessageService().sendMessage(body);
    }

    @Get("/")
    public async getMessages(@Query() to: string): Promise<Message[]> {
      return await new MessageService().getMessages();
    }

    @Get("/read")
    @SuccessResponse('200', 'Session Read')
    public async postSessions(@Body() body: Message['id']) {
      await new MessageService().markRead(body.id);
    }
}