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
  import type { CreateMessage, Message } from "../Types/message";
  import { MessageService } from "../Services/message";
import bodyParser from "body-parser";
import { Registration } from "../Types/registration";
  
  @Route("messages")
  @Middlewares(bodyParser.urlencoded({ extended: true }), bodyParser.json())
  export class MessageController extends Controller {
    @Post("/send")
    public async sendMessage(@Body() body: CreateMessage): Promise<Message['id']> {
      return await new MessageService().sendMessage(body);
    }

    @Get("/")
    public async getUnreadMessages(@Query() to: string): Promise<Message[]> {
      return await new MessageService().getUnreadMessages(to);
    }

    @Get("/all")
    public async getAllMessages(@Query() to: string): Promise<Message[]> {
      return await new MessageService().getAllMessages(to);
    }

    @Post("/read")
    public async markMessageRead(@Query() id: Message['id']) {
      await new MessageService().markRead(id);
    }
}