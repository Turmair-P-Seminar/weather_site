import express from "express";
import {supportedLanguages} from "./app.js";

const router = express.Router();

router.use(express.urlencoded({extended: false}));

router.post('/lang', function (req, res) {
    console.log(req.body.lng);
    req.session.lng = req.body.lng;
    return res.json({success: true}); //TODO: Only return one
    //res.redirect('back');
});

router.get('/lang-available', function (req, res) {
    let languages = supportedLanguages.filter(item => req.i18n.language !== item);
    languages.unshift(req.i18n.language);
    return res.json(languages);
})

export { router };
