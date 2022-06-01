const express = require("express");
const path = require("path");
const routes = require("./routes");

//const i18next = require("i18next");
//const Backend = require("i18next-fs-backend");
//const middleware = require("i18next-http-middleware");

//const i18middle = require("./i18n")

const hostname = '127.0.0.1';
const port = 3000;

// i18next
//     .use(middleware.LanguageDetector)
//     .use(Backend)
//     .init({
//         fallbackLng: 'de',
//         detectLngFromPath: true,
//         preload: ['en', 'de'],
//         ns: 'main',
//         backend: {
//             loadPath: './res/locales/{{lng}}/{{ns}}.json'
//         }
//     });

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//app.use(middleware.handle(i18next));
app.use(routes);
//app.use(i18next);
app.listen(app.get("port"), function (){
   console.log(`Server running at http://${hostname}:${port}/`);
});