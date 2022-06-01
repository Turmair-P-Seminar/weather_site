const express = require('express');

const app = express();

const path = require("path");

const hostname = '127.0.0.1';
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.get('/', function(req, res) {
//     console.log('Hello i18n');
//     res.render('index.ejs');
// });

app.listen(app.get("port"), function (){
    console.log(`Server running at http://${hostname}:${port}/`);
});

const i18n = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");

i18n.use(Backend).use(i18nextMiddleware.LanguageDetector).init({
    detection: {
        ignoreCase: true,
        order: ['session', 'querystring', 'header']
    },
    initImmediate: false, // setting initImediate to false, will load the resources synchronously
    whitelist: ['de', 'en'],
    nonExplicitWhitelist: true,
    load: 'languageOnly',
    fallbackLng: 'en',
    preload: ['de', 'en'],
    backend: {
        loadPath: './res/locales/{{lng}}/main.json'
    }
}, function() {
    //  i18nextMiddleware.addRoute(i18n, '/:lng/path2/', ['de', 'en'], app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
    //      console.log(req.i18n.languages[0]);
    //      //req.i18n.changeLanguage(req.i18n.languages[0]);
    //      res.render("index", {title: i18n.t("test-title")});
    // });
});

//app.use(express.bodyParser());
app.use(i18nextMiddleware.handle(i18n));

// app.get('/:lng/path2/', (req, res) => { //route.products/route.harddrives/route.overview
//     //console.log(req.i18n.languages[0]);
//     //req.i18n.changeLanguage(req.i18n.languages[0]);
//     res.render("index", {title: i18n.t("test-title")});
// });

app.get('/:lng/', (req, res) => {
    //var lng = req.language // 'de-CH'
    //var lngs = req.languages // ['de-CH', 'de', 'en']
    //req.i18n.changeLanguage('en') // will not load that!!! assert it was preloaded

    res.render("index", {title: req.i18n.t("test-title")});
});

app.get('/', (req, res) => {
    res.render("index", {title: req.i18n.t("test-title")});
});