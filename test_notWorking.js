const i18n = require("i18next");
const express = require("express");
const path = require("path");

const app = express();

i18n.init({initImmediate: false, // setting initImediate to false, will load the resources synchronously
    fallbackLng: 'de',
    preload: ["de", "en"],
    backend: {
        loadPath: './res/locales/{{lng}}/{{ns}}.json'
    }});

// Configuration block of express app
//app.use(express.bodyParser());
//app.use(i18n.handle);
//app.use(app.router);

const hostname = '127.0.0.1';
const port = 3000;

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));

app.get("/", function(req, res) {
    // current language
    var currentLng = req.locale;

    // access i18n
    var i18n = req.i18n;

    // translate
    var translation = i18n.t('test-title');
    res.send(translation);
});

app.listen(app.get("port"), function (){
    console.log(`Server running at http://${hostname}:${port}/`);
});