import generateSecret from "../shared-functionality/generateSecret.js";

export let addNonce = async (req, res, next) => {
    res.options = {nonce: generateSecret()};
    next();
};

export let addDefaultOptions = async (req, res, next) => {
    res.options = {...res.options, lang: req.i18n.language};
    next();
};