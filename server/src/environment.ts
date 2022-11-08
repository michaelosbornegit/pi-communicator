import dotenv from 'dotenv';
import path from 'path';

let dotenvPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: dotenvPath });

const {
    API_HOST = '',
    APP_HOST = '',
    PORT = '5501',
    PG_CONNECTION_STRING = ''
} = process.env;

const env = {
    API_HOST,
    APP_HOST,
    PORT,
    PG_CONNECTION_STRING
}

export default env;