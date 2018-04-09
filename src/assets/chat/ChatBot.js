const params = BotChat.queryParams(location.search);

const user = {
  id: params['userid'] || 'userid',
  name: params['username'] || 'username'
};

const bot = {
  id: params['botid'] || 'botid',
  name: params['botname'] || 'botname'
};

window['botchatDebug'] = params['debug'] && params['debug'] === 'true';

// Uncomment the followong block before deploying
const botConnection = new BotChat.DirectLine({
  domain: params['domain'],
  secret: 'yGEdM4QlNvk.cwA.u8g.ut2dVoTm_nsYeRmPEXk916LHznRYJ9K2fBDvPtbefN0',
  token: params['t'],
  webSocket: params['webSocket'] && params['webSocket'] === 'true' // defaults to true
});

// Uncomment the following block to use localdirect line
// const botConnection = new BotChat.DirectLine({
//     domain: 'http://localhost:3000/directline',
//     secret: 's',
//     token: 't',
//     webSocket: false
// });

BotChat.App({
  bot: bot,
  botConnection: botConnection,
  user: user
}, document.getElementById('bot'));

botConnection.activity$.filter(function (activity) {
    return activity.type === 'event';
}).subscribe(function (activity) {
    console.log('Activity received');
    window.parent.postMessage(activity, '*');
});