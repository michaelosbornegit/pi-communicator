import { markMessageRead, messagesToUser } from "../Models/messageModel";
import { findAllRegistrations, findOrCreateRegistration, updateRegistration } from "../Models/registrationModel";
import { CreateMessage, Message } from "../Types/message";
import { Registration } from "../Types/registration";

export class RegistrationService {
    public async findOrCreateRegistration(deviceId: string): Promise<string | undefined> {
        return await findOrCreateRegistration(deviceId);
    }

    public async findAllRegistrations(): Promise<Registration[]> {
        return await findAllRegistrations();
    }

    public async updateRegistration(registration: Registration): Promise<void> {
        return await updateRegistration(registration);
    }
}