// DotEnv Config
import 'dotenv/config';

// Common Imports
import fs from 'fs';
import path from 'path';
import http from "http";
import https from 'https';
import express from 'express';
import session from 'express-session';
import createMemoryStore from 'memorystore';
import KnexSessionStoreI from 'connect-session-knex';
const KnexSessionStore = KnexSessionStoreI(session);
import i18n from "i18next";
import i18nextMiddleware from "i18next-http-middleware";
import Backend from "i18next-fs-backend";
import {addRoutes} from './routes.js';
import {router} from './api_routes.js'
import helmet from "helmet";
import {csrfSync} from "csrf-sync";
import bodyParser from "body-parser";
import {addTemplateVariables, addNonce} from "./src/middlewares/customMiddlewares.js";
import {UsersDbConnector} from "./src/database-connections/UsersDbConnector.js";

// Language Configuration
const supportedLanguages = ['en', 'de']; // First is fallback language.
export {supportedLanguages};

// Credentials for HTTPS
const privateKey = fs.readFileSync(`https/${process.env.HTTPS_KEY_FILE}`, 'utf8');
const certificate = fs.readFileSync(`https/${process.env.HTTPS_CRT_FILE}`, 'utf8');
const credentials = {key: privateKey, cert: certificate};

// CSRF Protection Middleware Setup
export const {
    generateToken, // Use this to generate, store, and get a CSRF token.
    revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
    csrfSynchronisedProtection, // This is the default CSRF protection middleware.
} = csrfSync({
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromState: (req) => {
        return req.session.csrfToken;
    },
    getTokenFromRequest: (req) =>  {
        return req.body['CSRFToken'];
    },
    storeTokenInState: (req, token) => {
        req.session.csrfToken = token;
    },
    size: 256
});

// HTTP Server. Only exists for redirect to HTTPS. // We do need this
http.createServer(function (req, res) {
    res.writeHead(308, {'Location': `https://${process.env.HOSTNAME}:${process.env.PORT_HTTPS}` + req.url}); // 308 -> Moved permanently
    res.end();
}).listen(process.env.PORT_HTTP);

// HTTPS Server.
const app = express();
https.createServer(credentials, app).listen(process.env.PORT_HTTPS, function () {
    console.log(`Server running at https://${process.env.HOSTNAME}:${process.env.PORT_HTTPS}/.`);
});

// Application Config
app.set("views", "views");
app.set("view engine", "ejs");
app.set("port", process.env.PORT_HTTPS)

// The non-silver bullet
app.use(addNonce);
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'", (req, res) => `'nonce-${res.options.nonce}'`]
        }
    }
}));

// Static router for resources. These files are send with a "cache=true" header and are accessible for everyone.
app.use(express.static("res"));

// Create a session handler
const MemoryStore = createMemoryStore(session);
const KnexStore = new KnexSessionStore({
    knex: UsersDbConnector,
    disableDbCleanup: true,
    createtable: false
});
app.use(session({
    // store: new MemoryStore(session, {
    //     checkPeriod: 3600000 // prune expired entries every hour
    // }),
    store: KnexStore,
    cookie: {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
        sameSite: true, // strict
        secure: true // https only
    },
    secret: "This is NOT a secret", //TODO Move to an ENV variable, make rotating
    resave: false,
    saveUninitialized: false // Who doesn't like EU laws?
}));

// i18next Setup
i18n.use(Backend).use(i18nextMiddleware.LanguageDetector).use({
    type: 'postProcessor',
    name: 'link',
    process: function(value, key, options, translator) {
        return value.toLowerCase();
    }
}).init({
    detection: {
        ignoreCase: true,
        order: ['path', 'session', 'header']
    },
    initImmediate: false, // setting initImmediate to false, will load the resources synchronously
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

// csrf
app.use(bodyParser.urlencoded({ extended: false }))
app.use(csrfSynchronisedProtection)

// Apply i18n
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
    next();
})

// Api routes
app.use('/api', router);

// Common Template Variables
app.use(addTemplateVariables);

// Add all other routes
addRoutes(i18nextMiddleware, i18n, supportedLanguages, app);