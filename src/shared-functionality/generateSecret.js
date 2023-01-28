import {randomBytes} from 'crypto';

export default (size = 32) => {
    return randomBytes(size).toString('hex');
}
