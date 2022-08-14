
const { default: axios } = require('axios')
const { imageUrlValidator } = require('../utils/miscellaneous')

/**
 * Abstract class that represents a service to search for images across the web
 */
class ImageSearch {
    constructor() {
        if (this.constructor == ImageSearch) {
            throw new Error("Abstract classes can't be instantiated");
        }
    }
    fetchImages() {
        throw new Error("Method 'fetchImages()' must be implemented")
    }
}

/**
 * Class representing a third party service (Serp) that can query Google Images
 */
class GoogleImageSerpApi extends ImageSearch {
    #endpoint = "https://serpapi.com/search"
    //Ideally should come from a env.dev file of some kind
    #apiKey = "caa83370b13a5affcad9e1c5bcd5273e3da4ed5a17996d3f682407a087e87d6a"
    shuffle = false
    lookupText = ''
    /**
     * Sets the lookup text for a Google Image
     * @param {String} lookupText The text to lookup for a Google Image
     * @param {Boolean} shuffle A shuffle parameter to return a pseudo-random image
     */
    constructor(lookupText, shuffle = 0) {
        super()
        this.lookupText = lookupText
        this.shuffle = shuffle
    }
    /**
     * Gets a list of images using the Serp Google Image Search API
     * @returns {Array} A list of Google images with the image URL and title
     */
    async fetchImages() {
        //TODO - could create a custom query builder here or use the existing npm package for Serp
        let url = `${this.#endpoint}?q=${this.lookupText}&tbm=isch&ijn=0&api_key=${this.#apiKey}`
        let images = []
        if (!url || url === undefined) {
            images = []
        }
        else {
            let response = await axios.get(url)

            images = response.data.images_results
                .filter(image => imageUrlValidator(image.original))
                .map(image => {
                    return {
                        "link": image.original, "title": image.title
                    }
                })
            //If user shuffles, pick a random image from the first 100 results
            //TODO - technically, this is not random since it is confined to the first 100 images only
            if (this.shuffle) {
                //99 is the last valid index since there are only 100 images that are returned in the response
                let randomImageIndex =
                    parseInt((Math.random() * 100).toFixed()) < 100 ?
                        parseInt((Math.random() * 100).toFixed()) :
                        parseInt((Math.random() * 100).toFixed()) - 1
                images = [images[randomImageIndex]]
            }
            else {
                images = images.slice(0, 1)
            }
        }
        return images


    }
}

module.exports = {
    GoogleImageSerpApi
}