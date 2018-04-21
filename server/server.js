const http = require('http');
const io = require('socket.io');
const {addHandler, handle} = require('skid/lib/event');
const {start} = require('skid/lib/load');

require('./player');
require('./team');

addHandler('load_done', (state) => {
    const server = http.Server();
    const socket = io(server);

    handle(state, 'server_start', socket);

    server.listen(3000);
});

start(true);
