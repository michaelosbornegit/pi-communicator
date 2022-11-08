import { HostMachines } from "./enums";

export type CreateSession = {
    hostMachine: HostMachines;
    startCollectionDate: string;
    endCollectionDate: string;
    application: string;
    openTimeSeconds: number;
}

export type Session = CreateSession & {
    id: number;
};

export type CreateChromeSession = {
    url: string;
    navigationDate: string;
}

export type ChromeSession = CreateChromeSession & {
    id: number;
}

export type SessionBody = {
    sessions: CreateSession[];
}

export type ChromeSessionBody = {
    url: string;
    navigationDate: string;
}

export type DisplaySession = {
    applicationNames: string[];
    applicationTimeAndEndDate: { [id: string]: string | number; }[];
}