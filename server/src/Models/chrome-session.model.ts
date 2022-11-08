import { ChromeSession, CreateChromeSession, CreateSession, Session } from "../Types/session";
import pg from "./common";

const CHROME_SESSION_TABLE = "chrome-sessions";

export const insertChromeSession = async (session: CreateChromeSession) => {
  console.log(session);

  await pg<ChromeSession>(CHROME_SESSION_TABLE).insert(session);
};

export const allChromeSessions = async () => {
  const results = await pg<ChromeSession>(CHROME_SESSION_TABLE).select();
  return results;
};
