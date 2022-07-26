import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import express from 'express';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import i18n from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";
import {addRoutes} from './routes.js';
import {router} from './api_routes.js'

// Configuration below
const hostname = '127.0.0.1';
const port = 80; // Should be 3000 on linux (iptable routing). The Header upgrade below does not seem to be working with ports >999.
const portSave = 443; // Should be 8433 on linux (iptable routing). The Header upgrade below does not seem to be working with ports >999.
const supportedLanguages = ['en', 'de']; // First is fallback language.

export {supportedLanguages};

const privateKey = fs.readFileSync('https/wetter-turmair-de.key', 'utf8');
const certificate = fs.readFileSync('https/wetter-turmair-de.crt', 'utf8');
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

httpsServer.listen(portSave, function () {
    console.log(`Server running at https://${hostname}:${portSave}/`);
});

app.use(express.static("res"));

// Create a MemoryStore
const MemoryStore = createMemoryStore(session);

// App config
app.set("views", "views");
app.set("view engine", "ejs");
app.set("port", portSave)
// Cookie config
app.use(session({
    store: new MemoryStore(session, {
        checkPeriod: 3600000 // prune expired entries every hour
    }),
    cookie: {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        sameSite: true, // strict
        secure: true // https only
    },
    secret: "This is NOT a secret", //TODO Move to an ENV variable
    resave: false,
    saveUninitialized: false // Who doesn't like EU laws?
}));

// i18next setup
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
});

app.use(i18nextMiddleware.handle(i18n, {
    ignoreRoutes: [
        '/images/*',
        '/fonts/*',
        '/locales/*',
        '/style/*',
        '/api/*'
    ]
}));

// Set session
app.use(function (req, res, next) { // TODO Make this 100% legal
    if (!req.session.lng) {
        req.session.lng = req.i18n.language; // The language information is needed to provide functionality, should be ok for EU law without user consent
    }
    console.log(req.session);
    next()
})

// Api routes
app.use('/api', router);

// Add all routes
addRoutes(i18nextMiddleware, i18n, supportedLanguages, app, hostname, portSave);