const { default: axios } = require("axios")
const { GoogleImageSerpApi } = require("../helpers/ImageSearch")
const { getImageBlock, getActionElement } = require("../utils/blockBuilder")
let { constants } = require("../utils/constants")


/**
 * Parses any interaction payloads like button clicks, checkbox check/uncheck etc. 
 * @param {Object} req The Express request object
 * @param {Object} res The Express response object
 */
exports.parseInteractionPayload = async (req, res) => {
    let { payload } = { ...req.body }
    payload = JSON.parse(payload)
    let action = payload.actions.length > 0 ? payload.actions[0] : {}

    try {
        switch (action.action_id) {
            case constants.buttonTypes.SEND_BUTTON:
                //Sends back selected image as a block
                /*TODO - a good idea would be to send the image back 
                as the current user like Giphy does it*/
                await axios.post(payload.response_url, {
                    "text": action.value,
                    "blocks": [
                        getImageBlock(action.value, action.value)
                    ]
                })
                break
            case constants.buttonTypes.SHUFFLE_BUTTON:
                //Returns a new random image with the same lookup text
                res.json({
                    "text": "Shuffling images..."
                })
                let imageSearch = new GoogleImageSerpApi(action.value, true)
                let images = await imageSearch.fetchImages()
                if (images.length === 0) {
                    throw new Error("Invalid image url returned")
                }
                await axios.post(payload.response_url, {
                    "replace_original": "true",
                    "text": images[0].title,
                    "blocks": [
                        getImageBlock(images[0].title, images[0].link),
                        {
                            "type": "actions",
                            "elements": [
                                getActionElement(constants.actionConstants.BUTTON, {
                                    "text": "Send",
                                    "value": images[0].link,
                                    "actionId": constants.buttonTypes.SEND_BUTTON,
                                    "buttonStyle": "primary"
                                }),
                                getActionElement(constants.actionConstants.BUTTON, {
                                    "text": "Shuffle",
                                    "value": action.value,
                                    "actionId": constants.buttonTypes.SHUFFLE_BUTTON
                                }),
                                getActionElement(constants.actionConstants.BUTTON, {
                                    "text": "Cancel",
                                    "value": "cancel",
                                    "actionId": constants.buttonTypes.CANCEL_BUTTON,
                                    "buttonStyle": "danger"
                                })
                            ]
                        }
                    ]
                })
                break
            case constants.buttonTypes.CANCEL_BUTTON:
                //Deletes the image altogether
                await axios.post(payload.response_url, {
                    "delete_original": "true",
                })
                break
            default:
                throw new Error("Unrecognised action")

        }
    } catch (e) {
        console.log(e)
        await axios.post(req.body.response_url, {
            "text": "Sorry, slash commando. Something went wrong."
        })
    }



}