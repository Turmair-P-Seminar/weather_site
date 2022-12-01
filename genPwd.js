import {changePwd} from "./mysql-connector.js";
import bcrypt from 'bcryptjs';


let user = "Till";
let pwd = "IchMachNieWas";

let hash = bcrypt.hashSync(pwd, 16);
console.log(hash);
changePwd(user, hash);