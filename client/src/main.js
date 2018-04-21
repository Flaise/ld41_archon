
require('./viewport');
require('./preloader');
const {start} = require('skid/lib/load');

start(true);

const {addHandler} = require('skid/lib/event');
const io = require('socket.io-client');

addHandler('load_done', (state) => {
    const socket = io('http://localhost:3000', {transports: ['websocket']});
});
