const express = require("express")

const router = express.Router();

router.get("/", (req, res) => {
    var lng = req.language // 'de-CH'
    console.log(lng);
    //var lngs = req.languages // ['de-CH', 'de', 'en']
    //i18n.changeLanguage('en')
    res.render("index", {title: req.i18n.t('test-title')});
})

module.exports = router;