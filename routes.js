const addRoutes = function(i18nextMiddleware, i18n, supportedLanguages, app, hostname, portSave) {
    i18nextMiddleware.addRoute(i18n, '/:lng/path2/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.language);
        res.render("index", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    });

    // i18nextMiddleware.addRoute(i18n, '/:lng/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
    //     console.log(req.i18n.languages);
    //     if (req.i18n.language !== 'en') {
    //         res.writeHead(303, {'Location': `https://${hostname}:${portSave}` + '/'}); // 303 -> Get other
    //         res.end();
    //     } else {
    //         res.render("index", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    //     }
    // });

    i18nextMiddleware.addRoute(i18n, '/login', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages);
        res.render("login_page", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    });

    i18nextMiddleware.addRoute(i18n, '/registration', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages);
        res.render("registration", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    });

    i18nextMiddleware.addRoute(i18n, '/changepassword', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages);
        res.render("change_password", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    });

    i18nextMiddleware.addRoute(i18n, '/changeemail', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages);
        res.render("change-email", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    });

    i18nextMiddleware.addRoute(i18n, '/changeusername', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.languages);
        res.render("change-username", {title: req.i18n.t("test-title"), lang: req.i18n.language});
    });

    i18nextMiddleware.addRoute(i18n, '/', supportedLanguages, app, 'get', function(req, res) { //route.products/route.harddrives/route.overview
        console.log(req.i18n.language);
        // if (req.i18n.language === 'en') {
        //     res.writeHead(303, {'Location': `https://${hostname}:${portSave}` + '/en/'}); // 303 -> Get other
        //     res.end();
        // } else {
        res.render("index", {title: req.i18n.t("test-title"), lang: req.i18n.language});
        // }
    });
}

export { addRoutes }