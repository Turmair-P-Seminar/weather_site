import express from "express";
import {supportedLanguages} from "./app.js";
import {getPwd} from "./mysql-connector.js";
import bcrypt from 'bcryptjs';
import {requestLogin} from "./routes.js";

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

router.post('/login', function (req, res) {
    let email = "";
    if (req.body.email == null || req.body.password == null) {

    } else {
        email = req.body.email.toLowerCase().trim();
        console.log(email);
    }
    getPwd(email).then(hash => {
        console.log(hash);
        bcrypt.compare(req.body.password, hash, function(err, match) {
            if (match) { // Auth successful
                req.session.failed = false;
                req.session.isLoggedIn = true;
                return res.redirect(303, req.body.from);
            } else { // Auth failed
                req.session.failed = true;
                req.session.isLoggedIn = false;
                req.session.from = req.body.from;
                return res.redirect(303, "/login");
            }
        });

    });
});

router.get('/logout', function (req, res) {
    if (req.session.isLoggedIn !== true) {
        requestLogin(res, req);
    }
    req.session.destroy();
    return res.redirect(303, "/");
});

export { router };