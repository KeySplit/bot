const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// ROUTING

bot.onEvent = function(session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      welcome(session)
      break
  }
}

function onMessage(session, message) {
  welcome(session)
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'dashboard':
      dashboard(session)
      break
    case 'about':
      about(session)
      break
    case 'security':
      security(session)
      break
    case 'mainMenu':
      mainMenu(session)
      break
    case 'donate':
      donate(session)
      break
    }
}

function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Thanks for the payment! 🙏`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
}

// STATES

function welcome(session) {
  sendMessage(session, `Welcome to KeySplit! We help you store your private key phrase with people you trust. If you ever lose access to your wallet, they can help you recover it.`)

  mainMenu(session)
}

function dashboard(session) {
  sendMessage(session, `Unfortunately we can't do this yet. Bye sucka!`)

  mainMenu(session)
}

function about(session) {
  sendMessage(session, 'KeySplit lets you enter your wallet seed phrase and choose 5 contacts to share it with.')

  sendMessage(session, 'Each contact will receive an encrypted shard of your seed phrase. Their shard alone contains no useful information for them.')

  sendMessage(session, 'However, if you ever happen to lose your seed phrase, you can ask 3 of those 5 friends to send you the shard they are saving for you. Then you can use KeySplit to recreate your phrase and access your wallet!')

  session.reply(SOFA.Message({
    controls: [
      {type: 'button', label: 'Whats a seed phrase?', value: 'security'},
      {type: 'button', label: 'Main menu', value: 'mainMenu'}
    ]
  }))
}

function mainMenu(session) {
  session.reply(SOFA.Message({
    body: "What would you like to do?",
    controls: [
      {type: 'button', label: 'Go to my dashboard', action: 'Webview::http://keysplit-dapp.herokuapp.com/'},
      {type: 'button', label: 'How does KeySplit work?', value: 'about'},
      {type: 'button', label: 'Tell me about key security', value: 'security'},
      {type: 'button', label: 'Donate', value: 'donate'}
    ]
  }))
}

function security(session) {
  sendMessage(session, 'Your seed phrase/private keys are like your password to your online bank account. With cryptocurrency, you are your own bank. This is really cool! But with great power comes great responsibility...')

  sendMessage(session, 'If someone else gets your private keys, they can steal all of your cryptocurrency. If you lose your private key or seed phrase without having a backup, you cant ever access your funds.')

  sendMessage(session, 'Thats why one of the MOST IMPORTANT things you can do is save a backup of your seed phrase. Before KeySplit, the best way to do this was on a piece of paper. Since its not the 1970s, we decided to make KeySplit so you can store your phrase in a more reliable way.')

  session.reply(SOFA.Message({
    controls: [
      {type: 'button', label: 'Whats a seed phrase?', value: 'security'},
      {type: 'button', label: 'Main menu', value: 'mainMenu'}
    ]
  }))
}


function donate(session) {
  sendMessage(session, 'If you would like to donate to support KeySplit development, please use the Pay button at the top of your screen. Thank you so much!')

  mainMenu(session)
}

// HELPERS

function sendMessage(session, message) {
  let controls = []
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}
