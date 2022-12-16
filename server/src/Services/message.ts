import { markMessageRead, messagesToUser, sendMessage } from "../Models/messageModel";
import { CreateMessage, Message } from "../Types/message";
import { Registration } from "../Types/registration";

export class MessageService {
    public async getUnreadMessages(to: string): Promise<Message[]> {
        return await messagesToUser(to, true);
    }

    public async getAllMessages(to: string): Promise<Message[]> {
        return await messagesToUser(to);
    }

    public async sendMessage(message: CreateMessage): Promise<Message['id']> {
        return await sendMessage(message);
    }
    
    public async markRead(id: Message['id']): Promise<void> {
        await markMessageRead(id);
    }
}