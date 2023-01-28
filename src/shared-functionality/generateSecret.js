import {randomBytes} from 'crypto';

export const generateSecret = (size = 32) => {
    const secret = randomBytes(size);
    return secret.toString('hex');
}
