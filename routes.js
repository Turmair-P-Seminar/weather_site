const addRoutes = function(i18nextMiddleware, i18n, supportedLanguages, app) {
    i18nextMiddleware.addRoute(i18n, '/:lng/path2/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages[0]);
        res.render("index", {title: req.i18n.t("test-title")});
    });

    i18nextMiddleware.addRoute(i18n, '/:lng/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages);
        res.render("index", {title: req.i18n.t("test-title")});
    });

    i18nextMiddleware.addRoute(i18n, '/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages[0]);
        res.render("index", {title: req.i18n.t("test-title")});
    });
}

export { addRoutes }