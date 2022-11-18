import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Message } from "../Types/message";
import pg from './common';
dayjs.extend(utc)

const MESSAGE_TABLE = "messages";

export const messagesToUser = async (to: string) => {
  return await pg<Message>(MESSAGE_TABLE).select().where({ to });
};

export const sendMessage = async (message: Message) => {
  return await pg<Message>(MESSAGE_TABLE).insert(message).returning('id');
};

export const markMessageRead = async (id: Message['id']) => {
  await pg<Message>(MESSAGE_TABLE).update({ read: true, readAt: dayjs.utc().toISOString() }).where({ id });
};
