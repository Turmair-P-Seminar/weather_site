const addRoutes = function(i18nextMiddleware, i18n, supportedLanguages, app, hostname, portSave) { //TODO Fix this mess
    i18nextMiddleware.addRoute(i18n, '/:lng/path2/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.language);
        res.render("index", {title: req.i18n.t("test-title"), lang: req.i18n.language, site: "XYZ", nonce: res.locals.cspNonce});
    });

    i18nextMiddleware.addRoute(i18n, '/login', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("login", {title: getTitle(req, "login"), lang: req.i18n.language, site: "login", nonce: res.locals.cspNonce});
    });

    i18nextMiddleware.addRoute(i18n, '/registration', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("registration", {title: getTitle(req, "registration"), lang: req.i18n.language, site: "registration", nonce: res.locals.cspNonce});
    });

    i18nextMiddleware.addRoute(i18n, '/forgot', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("forgot", {title: getTitle(req, "forgot"), lang: req.i18n.language, site: "forgot", nonce: res.locals.cspNonce});
    });

    i18nextMiddleware.addRoute(i18n, '/about', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.languages);
        res.render("about", {title: getTitle(req, "about"), lang: req.i18n.language, site: "about", nonce: res.locals.cspNonce});
    });

    i18nextMiddleware.addRoute(i18n, '/', supportedLanguages, app, 'get', function(req, res) {
        console.log(req.i18n.language);
        // if (req.i18n.language === 'en') {
        //     res.writeHead(303, {'Location': `https://${hostname}:${portSave}` + '/en/'}); // 303 -> Get other
        //     res.end();
        // } else {
        res.render("index", {title: getTitle(req, "test-title"), lang: req.i18n.language, site: "index", nonce: res.locals.cspNonce});
        // }
    });
}

function getTitle(req, key) {
    return req.i18n.t(key) + req.i18n.t("title-common");
}

export { addRoutes }