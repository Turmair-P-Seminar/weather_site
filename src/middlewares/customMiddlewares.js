import generateSecret from "../shared-functionality/generateSecret.js";
import {generateToken} from "../../app.js";
import availableLanguages from "../shared-functionality/availableLanguages.js";

export let addNonce = async (req, res, next) => {
    res.options = {nonce: generateSecret()};
    next();
};

export let addTemplateVariables = async (req, res, next) => {
    res.options = {
        ...res.options,
        lang: req.i18n.language,
        languages: JSON.stringify(availableLanguages(req)),
        csrfToken: generateToken(req),
        isLoggedIn: req.session.isLoggedIn
    };
    next();
};