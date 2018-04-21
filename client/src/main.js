
require('./viewport');
require('./preloader');
const {start} = require('skid/lib/load');

start(true);

const {addHandler} = require('skid/lib/event');
const io = require('socket.io-client');

addHandler('load_done', (state) => {
    state.socket = io('http://localhost:3000', {transports: ['websocket']});

    const id = localStorage.getItem('id')
    if (id) {
        state.socket.emit('attach', id);
    } else {
        state.socket.emit('new');
    }

    state.socket.on('attached', (id) => {
        localStorage.setItem('id', id);
    });
});
