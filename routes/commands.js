let express = require('express');
let router = express.Router();
let { parseSlashCommand } = require("../controllers/commandController")
let bodyParser = require("body-parser");
let jsonParser = bodyParser.json()


/* Parses post payload from slack slash command */
router.post('/', jsonParser, parseSlashCommand);

module.exports = router;
