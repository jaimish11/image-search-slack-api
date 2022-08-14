let constants = require("../utils/constants").constants

/**
 * Gets the block object format for an image in BlockKit
 * 
 * @param {String} imageTitle The title of an image
 * @param {String} imageLink The URL of an image
 * @returns {Object} The block for an image
 */
exports.getImageBlock = (imageTitle, imageLink) => {
  return {
    "type": "image",
    "title": {
      "type": "plain_text",
      "text": imageTitle,
      "emoji": true
    },
    "image_url": imageLink,
    "alt_text": imageTitle
  }
}

/**
 * Gets the block object format for an action element in Slack's BlockKit
 * Currently only supports a button
 * @param {String} actionElementType The action element type which could a button, checkbox etc.
 * @param {Object} actionElementPayload The action element payload for a specific element type which contains element specific data
 * @returns {Object} The block for an action element
 */
exports.getActionElement = (actionElementType, actionElementPayload) => {
  switch (actionElementType) {
    case constants.actionConstants.BUTTON:
      return {
        "type": actionElementType,
        "text": {
          "type": "plain_text",
          "text": actionElementPayload.text,
          "emoji": true
        },
        "style": actionElementPayload.buttonStyle,
        "value": actionElementPayload.value,
        "action_id": actionElementPayload.actionId
      }
    //other types can be added here
    default:
      return {}
  }

}