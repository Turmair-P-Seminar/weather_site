const addRoutes = function(i18nextMiddleware, i18n, supportedLanguages, app, hostname, portSave) {
    i18nextMiddleware.addRoute(i18n, '/:lng/path2/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.language);
        res.render("index", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    });

    i18nextMiddleware.addRoute(i18n, '/:lng/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages);
        res.render("index", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    });

    i18nextMiddleware.addRoute(i18n, '/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.language);
        if (req.i18n.language === 'en') {
            res.writeHead(303, {'Location': `https://${hostname}:${portSave}` + '/en/'}); // 303 -> Get other
            res.end();
        } else {
            res.render("index", {title: req.i18n.t("test-title"), lang: req.i18n.language});
        }
    });
}

export { addRoutes }