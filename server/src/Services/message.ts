import { insertChromeSession } from "../Models/chrome-session.model";
import { allSessions, insertSessions, pastDaySessions } from "../Models/messageModel";
import { HostMachines } from "../Types/enums";
import type { DisplaySession, CreateChromeSession, Session, CreateSession } from "../Types/message";

export class SessionService {
    public async getAll(): Promise<Session[]> {
        return await allSessions();
    }

    public async getPastDaySessions(hostMachine: HostMachines, startTime: number, endTime: number): Promise<DisplaySession> {
        // TODO if end time is longer than 24 hours throw exception
        return await pastDaySessions(hostMachine, startTime, endTime);
    }
    
    public async create(sessions: CreateSession[]): Promise<void> {
        await insertSessions(sessions);
    }
    
    public async createChromeSession(session: CreateChromeSession): Promise<void> {
        await insertChromeSession(session);
    }
}