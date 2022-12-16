// import { HostMachines } from '@serverTypes/enums';
import { Registration } from '@serverTypes/registration';
import { CreateMessage, Message } from '@serverTypes/message';

const messageResource = `${process.env.REACT_APP_API_HOST}/messages` || '';
const registrationResource = `${process.env.REACT_APP_API_HOST}/registration` || '';
const deviceId = process.env.REACT_APP_DEVICE_ID;

if (!deviceId) {
  throw new Error('Device id not defined, make sure .env file is valid');
}

const enrichedFetch = async (
    url: string,
    options = {} as RequestInit,
    throwOnError = true
) => {
    const response = await fetch(url, options);
    if (response.status === 204) return response;
    if (response.status === 401) throw new Error('Unauthorized');
    if (response.status < 200 || response.status >= 300) {
      if (throwOnError) throw new Error('Failed API Call');
      return response;
    }
    let returnValue;
    try {
      returnValue = response.json();
    } catch (e) {
      returnValue = response;
    }
    return returnValue;
}

export const register = (): Promise<string> => {
    return enrichedFetch(`${registrationResource}/`, {
      method: 'POST',
      headers: { 'deviceId': deviceId }
    });
}

export const getMessages = (to: string): Promise<Message[]> => {
    return enrichedFetch(`${messageResource}?${new URLSearchParams({ to })}`);
}

export const readMessage = (messageId: number): Promise<void> => {
  return enrichedFetch(`${messageResource}/read?${new URLSearchParams({ id: String(messageId) })}`, {
    method: 'POST'
  });
}
