var i18n = require('i18n');

i18n.configure({
    // setup some locales - other locales default to en silently
    locales:['en', 'de'],

    // where to store json files - defaults to './locales' relative to modules directory
    directory: __dirname + '/res/locales',

    defaultLocale: 'en',

    // sets a custom cookie name to parse locale settings from  - defaults to NULL
    header: 'accept-language',
    queryParameter: 'lang',
    api: {
        __: 't', // now req.__ becomes req.t
    }
});

module.exports = function(req, res, next) {

    i18n.init(req, res);
    //res.local('__', res.__);

    var current_locale = i18n.getLocale();

    return next();
};