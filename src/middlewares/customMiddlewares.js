import crypto from "crypto";

export let addNonce = async (req, res, next) => {
    res.options = {nonce: crypto.randomBytes(16).toString("hex")};
    next();
};

export let addDefaultOptions = async (req, res, next) => {
    res.options = {...res.options, lang: req.i18n.language};
    next();
};