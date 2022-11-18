import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ApiError } from "../ApiError";
import { Message } from "../Types/message";
import { Registration } from "../Types/registration";
import pg from './common';
dayjs.extend(utc)

const REGISTRATION_TABLE = "device_registration";

export const findOrCreateRegistration = async (deviceId: string): Promise<User['id'] | undefined> => {
    // TOOD refactor these in to a separate generic lookup, then call them from the service layer
    const results = await pg<Registration>(REGISTRATION_TABLE).select().where({ deviceId }).first();

    if (!results) {
        await pg<Registration>(REGISTRATION_TABLE).insert({ deviceId }).returning('username');
    }

    return results?.username;
};

export const findAllRegistrations = async (): Promise<Registration[]> => {
    return await pg<Registration>(REGISTRATION_TABLE).select();
};

export const updateRegistration = async (registration: Registration): Promise<void> => {
    const result = await pg<Registration>(REGISTRATION_TABLE).select().where({ deviceId: registration.deviceId }).first();

    if (!result) {
        throw new ApiError('No device registered with given deviceId', 403);
    } else if (result.username) {
        throw new ApiError('Device is already registered to a user', 403);
    }

    await pg<Registration>(REGISTRATION_TABLE).update({ username: registration.username }).where({ deviceId: registration.deviceId }).first();
};