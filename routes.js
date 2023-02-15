import {generateToken, supportedLanguages} from "./app.js";

const addRoutes = function(i18nextMiddleware, i18n, supportedLanguages, app) { //TODO Fix this mess
    i18nextMiddleware.addRoute(i18n, '/:lng/path2/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.language);
        res.render("index", addDefaultConfig(req, res, {title: req.i18n.t("test-title"), site: "XYZ"}));
    });

    i18nextMiddleware.addRoute(i18n, '/login', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        requestLogin(res, req)
    });

    i18nextMiddleware.addRoute(i18n, '/registration', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("registration", addDefaultConfig(req, res, {title: getTitle(req, "registration"), site: "registration"}));
    });

    i18nextMiddleware.addRoute(i18n, '/forgot', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("forgot", addDefaultConfig(req, res, {title: getTitle(req, "forgot"), site: "forgot"}));
    });

    i18nextMiddleware.addRoute(i18n, '/about', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("about", addDefaultConfig(req, res,{title: getTitle(req, "about"), site: "about", nonce: res.locals.cspNonce}));
    });

    i18nextMiddleware.addRoute(i18n, '/link3', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("unfinished", addDefaultConfig(req, res,{title: getTitle(req, "link3"), site: "unfinished", nonce: res.locals.cspNonce}));
    });

    i18nextMiddleware.addRoute(i18n, '/register', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("register", addDefaultConfig(req, res,{title: getTitle(req, "register"), site: "register", nonce: res.locals.cspNonce}));
    });

    i18nextMiddleware.addRoute(i18n, '/change-password', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("change-password", addDefaultConfig(req, res,{title: getTitle(req, "change-password"), site: "change-password", nonce: res.locals.cspNonce}));
    });

    i18nextMiddleware.addRoute(i18n, '/nutzung', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("agreement", addDefaultConfig(req, res,{title: getTitle(req, "Useragrement"), site: "agreement", nonce: res.locals.cspNonce}));
    });

    i18nextMiddleware.addRoute(i18n, '/', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.language);
        res.render("index", addDefaultConfig(req, res, {title: getTitle(req, "test-title"), site: "index"}));
    });
}

function getTitle(req, key) {
    return req.i18n.t(key) + req.i18n.t("title-common");
}

function addDefaultConfig(req, res, obj) {
    return {
        ...obj,
        ...res.options
    };
}
const requestLogin = function (res, req) {
    if (req.session.from == null || typeof req.session.from !== 'string') {
        req.session.from = "/"
    }
    let fail = "";
    if (req.session.failed === true) {
        fail = 'Login failed: Wrong credentials';
    }
    res.render("login", addDefaultConfig(req, res, {title: getTitle(req, "login"), site: "login", from: req.session.from, failed: fail}));
}

export { requestLogin }

export { addRoutes }