/**
 * Validates image URLs so that the blocks for BlockKit still remain valid
 * @param {String} imageUrl The image URL
 * @returns {Boolean} The result of an image URL being valid or not
 */
exports.imageUrlValidator = (imageUrl) => {
    /*imageUrl length filter required because the response_url endpoint 
    will not accept an actionId > 256 characters */

    /*TODO - if image cannot be downloaded for whatever reason, 
    the resulting block will be invalid*/
    
    return imageUrl.length <= 256
        && !imageUrl.includes(".svg");
}