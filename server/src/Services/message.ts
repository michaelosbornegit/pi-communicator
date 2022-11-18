import { markMessageRead, messagesToUser } from "../Models/messageModel";
import { CreateMessage, Message } from "../Types/message";
import { User } from "../Types/user";

export class MessageService {
    public async getMessages(to: User['username']): Promise<Message[]> {
        return await messagesToUser(to);
    }

    public async sendMessage(message: CreateMessage): Promise<Message['id']> {
        return await this.sendMessage(message);
    }
    
    public async markRead(id: Message['id']): Promise<void> {
        await markMessageRead(id);
    }
}