const SlackBot = require('slackbots');
const axios = require('axios');

const API_KEY = `xoxb-2267473635187-2260613728838-vb1FkJgSCPfCpCGpzxmb1NUu`;
const USER_NAME = `jokes`;

const HELP_MESSAGE = `Type @${USER_NAME} with either chucknorris, yomamma, help, or random`;
const params = {
    icon_emoji: ':smiley:'
};

const bot = new SlackBot({
    token: API_KEY,
    name: USER_NAME
});

const getCheckJoke = () => {
    axios.get('http://api.icndb.com/jokes/random')
    .then(res => {
        const joke = res?.data?.value?.joke || "Error";
        bot.postMessage('general', joke, params);
    })
}

const getYoManaJoke = () => {
    axios.get('https://api.yomomma.info')
    .then(res => {
        const joke = res?.data?.joke || "Error";
        bot.postMessage('general', joke, params);
    })
}

const randomJoke = () => {
    const rand = Math.floor(Math.random() * 2);
    if (rand === 0) {
        getCheckJoke()
    } else {
        getYoManaJoke();
    }
}

const handleMessage = (message) => {
    if (message.includes('chucknorris')) {
        getCheckJoke();
    } else if (message.includes('yomamma')) {
        getYoManaJoke();
    } else if (message.includes('random')){
        randomJoke();
    } else if (message.includes('help')){
        bot.postMessage('general', HELP_MESSAGE, params);
    }
}

bot.on('start', () => {
    bot.postMessage('general', HELP_MESSAGE, params);
})

bot.on('error', (error) => console.log(error));

bot.on('message', (data) => {
    if (data.type !== 'message' 
    || data.subtype === 'bot_message'
    || data.username ===  USER_NAME) {
        return;
    }

    handleMessage(data.text)
})
