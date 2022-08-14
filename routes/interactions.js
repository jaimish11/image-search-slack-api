let express = require('express');
let router = express.Router();
let bodyParser = require("body-parser");
const { parseInteractionPayload } = require('../controllers/interactionController');
let jsonParser = bodyParser.json()


router.post('/', jsonParser, parseInteractionPayload);

module.exports = router;
