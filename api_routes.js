import express from "express";
import {supportedLanguages} from "./app.js";

const router = express.Router();

router.use(express.urlencoded({extended: false}));

router.post('/lang', function (req, res) {
    console.log(req.body.lng);
    req.session.lng = req.body.lng;
    return res.status(200).json({success: true});
});

router.get('/lang-available', function (req, res) {
    let languages = supportedLanguages.filter(item => req.i18n.language !== item);
    languages.unshift(req.i18n.language);

    const map1 = new Map();
    for (const lang of languages) {
        map1.set(lang, req.i18n.t(`header.languages.${lang}`))
    }
    return res.status(200).json(Object.fromEntries(map1));
})

export { router };
