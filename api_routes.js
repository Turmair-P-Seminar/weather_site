// Imports
import express from "express";
import {supportedLanguages} from "./app.js";
import {getPwd} from "./src/database-connections/UsersDbConnector.js";
import bcrypt from 'bcryptjs';
import {requestLogin} from "./routes.js";
import {PublicDataDbConnector} from "./src/database-connections/PublicDataDbConnector.js";

// All paths provided by this router are prefixed by '/api'.
const router = express.Router();
router.use(express.urlencoded({extended: false}));

// Lang Endpoint. This endpoint is called by the client to set its language.
router.post('/lang', function (req, res) {
    console.log(req.body.lng);
    req.session.lng = req.body.lng;
    return res.status(200).json({success: true});
});

// Lang-Available Endpoint. This endpoint returns all available languages.
router.get('/lang-available', function (req, res) {
    let languages = supportedLanguages.filter(item => req.i18n.language !== item);
    languages.unshift(req.i18n.language);

    const map1 = new Map();
    for (const lang of languages) {
        map1.set(lang, req.i18n.t(`header.languages.${lang}`))
    }
    return res.status(200).json(Object.fromEntries(map1));
})

// Login Endpoint. This endpoint is called when someone tries to log in. The endpoint handles the request and refers the user if applicable.
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

// Logout Endpoint. Calling this will log out a user.
router.get('/logout', function (req, res) { // TODO Maybe this should be a POST endpoint for security reasons?
    if (req.session.isLoggedIn !== true) {
        requestLogin(res, req);
    }
    req.session.destroy();
    return res.redirect(303, "/");
});

// Table Data Endpoint: Returns data required to create the chart
    let cresult2= 0;

router.get('/chartdata', function (req, res) {
    if (cachetest + 120 >= now) {
        return res.status(200).json(cresult2[0][0]);
    } else {
        PublicDataDbConnector.transaction(trx => {
            return PublicDataDbConnector.raw(
                'call weewx.getClimateData(?);',
                [7]
            ).then();
        }).then(result => {
            console.table(result[0][0]);
            cresult2 = result;
            return res.status(200).json(result[0][0]);
        });
        //return res.status(200); //.json(Object.fromEntries(map1));
    }});

// Herausfinden der aktuellen Temperatur
    let cachetest = 0;
    let cresult = 0;
    let now = Math.floor(Date.now() / 1000);
router.get('/temperatur', function (req, res) {
    now = Math.floor(Date.now() / 1000);
    if (cachetest + 120 >= now) {
        return res.status(200).json(cresult[0][0]);
    } else {
        PublicDataDbConnector.transaction(trx => {
            return PublicDataDbConnector.raw(
                'call weewx.getTemperatur();',
            ).then();
        }).then(result => {
            console.table(result[0][0]);
            cresult = result;
            cachetest = now;
            return res.status(200).json(result[0][0]);

        });

    }});


export { router };