const botConnection = new BotChat.DirectLine({
    domain: 'http://localhost:3000/directline',
    secret: 's',
    token: 't',
    webSocket: false
});

// We launch the bot chat application
BotChat.App({
    directLine: botConnection,
    user: { id: 'userid' },
    bot: { id: 'botid' },
    resize: 'detect'
  }, 
  document.getElementById("bot")
);

botConnection.activity$.filter(function (activity) {
    return activity.type === 'event' && activity.name === 'searchResult';
}).subscribe(function (activity) {
    console.log('"searchResult" received with value: ' + activity.value);
    searchResult(activity.value);
});

function searchResult(result) {
    sendMessage(result);
}

// Send a message to the parent
function sendMessage (msg) {
    console.log(`message sent to parent: ${msg}`);
    window.parent.postMessage(msg, '*');
};