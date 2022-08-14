const { App } = require('@slack/bolt');
/**
 * API wrapper for Bolt
 * Currently not used as all the communication is done through the response_url itself
 */


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

exports.postMessage = async (channelId, text, blocks = []) => {
    return await app.client.chat.postMessage({
        channel: channelId,
        text: text,
        blocks: blocks
    })
}

exports.openConversation = async (users) => {
    return await app.client.conversations.open({
        users: users,
        
    })
}


exports.getMembers = async (channelId) => {
    return await app.client.conversations.members({
        channel: channelId
    })
}

exports.getConversations = async () => {
    return await app.client.conversations.list()
}