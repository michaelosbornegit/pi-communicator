import { markMessageRead, messagesToUser } from "../Models/messageModel";
import { findAllRegistrations, findOrCreateRegistration, updateRegistration } from "../Models/registrationModel";
import { CreateMessage, Message } from "../Types/message";
import { Registration } from "../Types/registration";
import { User } from "../Types/user";

export class RegistrationService {
    public async findOrCreateRegistration(deviceId: string): Promise<User['id'] | undefined> {
        return await findOrCreateRegistration(deviceId);
    }

    public async findAllRegistrations(): Promise<Registration[]> {
        return await findAllRegistrations();
    }

    public async updateRegistration(registration: Registration): Promise<void> {
        return await updateRegistration(registration);
    }
}