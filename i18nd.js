//import { dirname, join } from 'path'
//import { readdirSync, lstatSync } from 'fs'
//import { fileURLToPath } from 'url'

const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const i18nextMiddleware = require('i18next-http-middleware')
const router = require("./routes")

//const __dirname = dirname(fileURLToPath(import.meta.url))
//const localesFolder = join(__dirname, '../locales')

i18next
    .use(Backend) // you can also use any other i18next backend, like i18next-http-backend or i18next-locize-backend
    .use(i18nextMiddleware.LanguageDetector) // the language detector, will automatically detect the users language, by some criteria... like the query parameter ?lng=en or http header, etc...
    .init({
        initImmediate: false, // setting initImediate to false, will load the resources synchronously
        fallbackLng: 'de',
        preload: ["de", "en"],
        backend: {
            loadPath: './res/locales/{{lng}}/{{ns}}.json'
        }
    }, () => {
        i18nextMiddleware.addRoute(
            i18next,
            '/:lng/key-to-translate',
            ['en', 'de'],
            router,
            'get',
            (req, res) => {
                //endpoint function
                res.render("index", {title: req.i18n.t('test-title')});
            }
        )
    });

//export {i18next, i18nextMiddleware.handle(i18next)}
//module.export = i18nextMiddleware.handle(i18next);
//module.export = i18next;
//export { i18next, i18nextPlugin: i18nextMiddleware.plugin }
//export { i18next, i18nextPlugin: i18nextMiddleware.plugin }
//module.export =  i18nextMiddleware.handle(i18next);

export { i18next, i18nextPlugin: i18nextMiddleware.plugin }