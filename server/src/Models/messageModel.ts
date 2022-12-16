import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CreateMessage, Message } from "../Types/message";
import pg from './common';
dayjs.extend(utc)

const MESSAGE_TABLE = "messages";

export const messagesToUser = async (to: string, unread: boolean = false) => {
  return await pg<Message>(MESSAGE_TABLE).select().where({ to, read: !unread });
};

export const sendMessage = async (message: CreateMessage) => {
  const results = await pg<Message>(MESSAGE_TABLE).insert(message).returning('id');

  return results[0].id;
};

export const markMessageRead = async (id: Message['id']) => {
  await pg<Message>(MESSAGE_TABLE).update({ read: true, readAt: dayjs.utc().toISOString() }).where({ id });
};
