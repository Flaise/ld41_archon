const {addHandler, handle} = require('skid/lib/event');
const io = require('socket.io-client');

addHandler('load_done', (state) => {
    state.socket = io('http://localhost:3000', {transports: ['websocket']});

    state.socket.on('connect', () => {
        const id = localStorage.getItem('id');
        if (id) {
            console.log('attaching')
            state.socket.emit('attach', id);
        } else {
            console.log('new')
            state.socket.emit('new');
        }
    });

    state.socket.on('command', ({command, argument}) => {
        handle(state, command, argument);
    });
});

addHandler('attached', (state, id) => {
    localStorage.setItem('id', id);
});
