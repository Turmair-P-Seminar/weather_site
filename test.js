
var express = require('express');
var i18n = require('./i18n2');

var app = express();

app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(i18n);

app.get('/', function(req, res) {
    console.log(res.t('Hello i18n'));
    //res.render('index.ejs');
    res.render("index", {title: res.t('test-title')});
});

app.listen('3000');