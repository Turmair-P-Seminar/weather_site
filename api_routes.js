import express from "express";

const router = express.Router();

router.use(express.json());

router.post('/lang', function (req, res) {
    console.log(req.body.la)
    req.session.lng = req.body.la;
    return res.json({success: req.body.la}); //TODO: Only return one
    return res.redirect('back');
});

export { router };
