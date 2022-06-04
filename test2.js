const fs = require('fs');
const path = require("path");
const http = require('http');
const https = require('https');
const express = require('express');
const session = require('express-session');
const i18n = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");

// Configuration below
const hostname = '127.0.0.1';
const port = 80; // Should be 3000 on linux (iptable routing). The Header upgrade below does not seem to be working with ports >999.
const portSave = 443; // Should be 8433 on linux (iptable routing). The Header upgrade below does not seem to be working with ports >999.
const supportedLanguages = ['en', 'de']; // First is fallback language.

const privateKey = fs.readFileSync('res/https/wetter-turmair-de.key', 'utf8');
const certificate = fs.readFileSync('res/https/wetter-turmair-de.crt', 'utf8');
// Configuration above

// Credential store for https
const credentials = {key: privateKey, cert: certificate};

// http Server. Only exists for session upgrade to https.
http.createServer(function (req, res) {
    res.writeHead(308, {'Location': `https://${hostname}:${portSave}` + req.url}); // 308 -> Moved permanently
    res.end();
}).listen(port);

// Creates the https server component
const app = express();
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(portSave, function (){
    console.log(`Server running at https://${hostname}:${portSave}/`);
});

// App config
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("port", portSave)
// Cookie config
app.use(session({
    cookie: {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        sameSite: true, // strict
        secure: true // https only
    },
    secret: "This is NOT a secret", //TODO Move to an ENV variable
    saveUninitialized: false // Who doesn't like EU laws?
}));

// i18next routes
i18n.use(Backend).use(i18nextMiddleware.LanguageDetector).init({
    debug: true,
    detection: {
        ignoreCase: true,
        order: ['path', 'session', 'header']
    },
    initImmediate: false, // setting initImediate to false, will load the resources synchronously
    load: 'languageOnly',
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    fallbackLng: supportedLanguages[0],
    preload: supportedLanguages,
    lookupSession: 'lng',
    backend: {
        loadPath: './res/locales/{{lng}}/main.json'
    }
}, function() {
     /*i18nextMiddleware.addRoute(i18n, '/:lng/path2/', ['de', 'en'], app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
         console.log(i18n.languages[0]);
         console.log(i18n.languages);
         //i18n.changeLanguage(i18n.languages[0]);
         res.render("index", {title: i18n.t("test-title")});
    });*/
});

app.use(i18nextMiddleware.handle(i18n, {
    //ignoreRoutes: ['/res*']
}));

// Set session
app.use(function (req, res, next) { //TODO Make this 100% legal
    if (!req.session.lng) {
        req.session.lng = req.i18n.language; // The language information is needed to provide functionality, should be ok for EU law without user consent
    }
    console.log(req.session);
    next()
})

i18nextMiddleware.addRoute(i18n, '/:lng/path2/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
    console.log(req.i18n.languages[0]);
    res.render("index", {title: req.i18n.t("test-title")});
});

/* app.get('/:lng/path2/', (req, res) => { //route.products/route.harddrives/route.overview
     //console.log(req.i18n.languages[0]);
     //req.i18n.changeLanguage(req.i18n.languages[0]);
     res.render("index", {title: i18n.t("test-title")});
 });*/

// app.get('/:lng/', (req, res) => {
//     console.log(req.i18n.languages[0]);
//     //var lng = req.language // 'de-CH'
//     //var lngs = req.languages // ['de-CH', 'de', 'en']
//     //req.i18n.changeLanguage('en') // will not load that!!! assert it was preloaded
//
//     res.render("index", {title: req.i18n.t("test-title")});
// });

i18nextMiddleware.addRoute(i18n, '/:lng/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
    console.log(req.i18n.languages);
    res.render("index", {title: req.i18n.t("test-title")});
});

// app.get('/', (req, res) => {
//     res.render("index", {title: req.i18n.t("test-title")});
// });

i18nextMiddleware.addRoute(i18n, '/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
    console.log(req.i18n.languages[0]);
    res.render("index", {title: req.i18n.t("test-title")});
});