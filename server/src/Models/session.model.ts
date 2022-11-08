import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { HostMachines } from "../Types/enums";
import type { CreateSession, DisplaySession, Session } from "../Types/session";
import pg from "./common";
dayjs.extend(utc)

const SESSION_TABLE = "sessions";

export const insertSessions = async (sessions: CreateSession[]) => {
  await pg<Session>("sessions").insert(sessions);
};

export const allSessions = async () => {
  const results = await pg<Session>(SESSION_TABLE).select();
  return results;
};

export const pastDaySessions = async (hostMachine: HostMachines, startTime: number, endTime: number) => {
  const results = await pg<Session>(SESSION_TABLE).select().where({ hostMachine }).where('endCollectionDate', '>=', dayjs.utc().subtract(startTime, 'hours').toISOString()).where('endCollectionDate', '<', dayjs.utc().subtract(endTime, 'hours').toISOString()).orderBy('endCollectionDate', 'asc');

  const displaySession: DisplaySession = {
    applicationNames: [],
    applicationTimeAndEndDate: [],
  };

  // Map to digestable sessions
  for (let i = 0; i < results.length; i++) {
    if (displaySession.applicationNames.findIndex((session) => session === results[i].application) === -1) {
      displaySession.applicationNames.push(results[i].application);
    }
    
    const currentEndDate = dayjs.utc(results[i].endCollectionDate).unix();
    const usageInfo: { [id: string]: string | number } = {};
    usageInfo['endCollectionDate'] = dayjs.utc(results[i].endCollectionDate).unix();

    let totalTime = 0;
    usageInfo[results[i].application] = results[i].openTimeSeconds;
    totalTime += results[i].openTimeSeconds;
    while (i < results.length - 1 && currentEndDate == dayjs.utc(results[i + 1].endCollectionDate).unix()) {
      i++;
      if (displaySession.applicationNames.findIndex((session) => session === results[i].application) === -1) {
        displaySession.applicationNames.push(results[i].application);
      }
      usageInfo[results[i].application] = results[i].openTimeSeconds;
      totalTime += results[i].openTimeSeconds;
    }

    usageInfo['totalTime'] = totalTime;
    displaySession.applicationTimeAndEndDate.push(usageInfo);
  }

  return displaySession;
};
