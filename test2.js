const fs = require('fs');
const path = require("path");
const http = require('http');
const https = require('https');
const express = require('express');
const i18n = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");

// Configuration below
const hostname = '127.0.0.1';
const port = 80; // Should be 3000 on linux (iptable routing). The Header upgrade below does not seem to be working with ports >999.
const portSave = 443; // Should be 8433 on linux (iptable routing). The Header upgrade below does not seem to be working with ports >999.

const privateKey = fs.readFileSync('res/https/wetter-turmair-de.key', 'utf8');
const certificate = fs.readFileSync('res/https/wetter-turmair-de.crt', 'utf8');
// Configuration above

// Credentials for https
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

// i18next routes
i18n.use(Backend).use(i18nextMiddleware.LanguageDetector).init({
    debug: true,
    detection: {
        ignoreCase: true,
        order: ['path', 'session', 'header']
    },
    initImmediate: false, // setting initImediate to false, will load the resources synchronously
    load: 'languageOnly',
    supportedLngs: ['de', 'en'],
    nonExplicitSupportedLngs: true,
    fallbackLng: 'en',
    preload: ['de', 'en'],
    backend: {
        loadPath: './res/locales/{{lng}}/main.json'
    }
}, function() {
     i18nextMiddleware.addRoute(i18n, '/:lng/path2/', ['de', 'en'], app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
         console.log(i18n.languages[0]);
         console.log(i18n.languages);
         i18n.changeLanguage(i18n.languages[0]);
         res.render("index", {title: i18n.t("test-title")});
    });
});

app.use(i18nextMiddleware.handle(i18n));

 app.get('/:lng/path2/', (req, res) => { //route.products/route.harddrives/route.overview
     //console.log(req.i18n.languages[0]);
     //req.i18n.changeLanguage(req.i18n.languages[0]);
     res.render("index", {title: i18n.t("test-title")});
 });

app.get('/:lng/', (req, res) => {
    //var lng = req.language // 'de-CH'
    //var lngs = req.languages // ['de-CH', 'de', 'en']
    //req.i18n.changeLanguage('en') // will not load that!!! assert it was preloaded

    res.render("index", {title: req.i18n.t("test-title")});
});

app.get('/', (req, res) => {
    res.render("index", {title: req.i18n.t("test-title")});
});