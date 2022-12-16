// import { HostMachines } from '@serverTypes/enums';
import { Registration } from '@serverTypes/registration';
import { CreateMessage } from '@serverTypes/message';

const messageResource = `${process.env.REACT_APP_API_HOST}/messages` || '';
const registrationResource = `${process.env.REACT_APP_API_HOST}/registration` || '';

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
    return response.json();
}

export const getRegistrations = (): Promise<Registration[]> => {
    return enrichedFetch(`${registrationResource}/`);
}

export const sendMessage = (message: CreateMessage): Promise<Registration[]> => {
    return enrichedFetch(`${messageResource}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
}
