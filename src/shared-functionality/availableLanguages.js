import {supportedLanguages} from "../../app.js";

export default (req) => {
    const arr = [];
    for (let i = 0; i < supportedLanguages.length; i++) {
        arr.push({code: "", name: ""});
        arr[i].code = supportedLanguages[i];
        arr[i].name = req.i18n.t("header.languages." + supportedLanguages[i]);
    }
    return arr;
}