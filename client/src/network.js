const {addHandler, handle} = require('skid/lib/event');
const io = require('socket.io-client');

const socket = io('http://localhost:3000', {transports: ['websocket'], autoConnect: false});

addHandler('load_done', (state) => {
    socket.open();

    socket.on('connect', () => {
        const id = localStorage.getItem('id');
        if (id) {
            socket.emit('attach', id);
        } else {
            socket.emit('new');
        }
    });

    socket.on('command', ({command, argument}) => {
        handle(state, command, argument);
    });
});

function serverHandle(command, argument) {
    socket.emit('command', {command, argument});
}
exports.serverHandle = serverHandle;

addHandler('attached', (state, id) => {
    localStorage.setItem('id', id);
});
