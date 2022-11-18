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
import { User } from "../Types/user";
  
  @Route("messages")
  @Middlewares(bodyParser.urlencoded({ extended: true }), bodyParser.json())
  export class MessageController extends Controller {
    @Post("/send")
    @SuccessResponse('201', 'Message Sent!')
    public async sendMessage(@Body() body: CreateMessage): Promise<Message['id']> {
      return await new MessageService().sendMessage(body);
    }

    @Get("/")
    public async getMessages(@Query() to: User['username']): Promise<Message[]> {
      return await new MessageService().getMessages(to);
    }

    @Post("/read")
    @SuccessResponse('200', 'Session Read')
    public async markMessageRead(@Query() id: Message['id']) {
      await new MessageService().markRead(id);
    }
}