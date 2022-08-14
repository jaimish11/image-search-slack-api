
const { default: axios } = require("axios");
const { GoogleImageSerpApi } = require("../helpers/ImageSearch");
let { getImageBlock, getActionElement } = require("../utils/blockBuilder");
let { constants } = require('../utils/constants');

/**
 * Parses slash commands for the app
 * Currently handles only /image-search [lookup text]
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 */
exports.parseSlashCommand = async (req, res) => {
  if (!req.body.text) {
    res.json({
      "text": "Sorry, slash commando, we didn't find any search text. Please try again."
    })
  }
  else {
    res.json({
      "text": "Getting images..."
    })
    try {
      //Hit Serp (third party provider) to get image search results
      let imageSearch = new GoogleImageSerpApi(req.body.text)
      let images = await imageSearch.fetchImages()
      let blocks = { "blocks": [] }

      if (images.length === 0) {
        throw new Error("Invalid image url returned")
      }

      //Create image + Send button block format
      blocks.blocks = images.reduce(function (result, image) {
        result.push(getImageBlock(image.title, image.link), {
          "type": "actions",
          "elements": [
            getActionElement(constants.actionConstants.BUTTON, {
              "text": "Send",
              "value": image.link,
              "actionId": constants.buttonTypes.SEND_BUTTON,
              "buttonStyle": "primary"
            }),
            getActionElement(constants.actionConstants.BUTTON, {
              "text": "Shuffle",
              "value": req.body.text,
              "actionId": constants.buttonTypes.SHUFFLE_BUTTON
            }),
            getActionElement(constants.actionConstants.BUTTON, {
              "text": "Cancel",
              "value": "cancel",
              "actionId": constants.buttonTypes.CANCEL_BUTTON,
              "buttonStyle": "danger"
            })
          ]
        });

        return result;
      }, []);
      await axios.post(req.body.response_url, blocks)
    }

    catch (e) {
      console.log(e)
      await axios.post(req.body.response_url, {
        "text": "Sorry, slash commando. Something went wrong."
      })

    }


  }

}