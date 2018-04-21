const http = require('http');
const io = require('socket.io');
const {addHandler, handle} = require('skid/lib/event');
const {remove} = require('skid/lib/array');

exports.playerHandle = function playerHandle(player, command, argument) {
    clientHandle(player.client, command, argument);
}

function clientHandle(client, command, argument) {
    client.emit('command', {command, argument});
}
exports.clientHandle = clientHandle;

addHandler('load', (state) => {
    state.players = {list: []};
});

function newPlayer(state, client) {
    const id = `${Date.now()}${Math.random()}`;
    attachNew(state, client, id);
}

function attach(state, client, id) {
    for (const player of state.players.list) {
        if (player.id === id) {
            clearTimeout(player.disconnecting);
            player.client.disconnect(true);
            player.client = client;
            clientHandle(client, 'attached', id);
            handle(state, 'player_reconnect', player);
            return;
        }
    }
    attachNew(state, client, id);
}

function attachNew(state, client, id) {
    const player = {id, client};
    state.players.list.push(player);
    clientHandle(client, 'attached', id);
    handle(state, 'player_new', player);
}

function disconnect(state, player) {
    remove(state.players.list, player);
    handle(state, 'player_end', player);
}

function disconnectClientLater(state, client) {
    for (let i = 0; i < state.players.list.length; i += 1) {
        const player = state.players.list[i];
        if (player.client === client) {
            player.disconnecting = setTimeout(() => {
                disconnect(state, player);
            }, 9000);
        }
    }
}

addHandler('load_done', (state) => {
    const server = http.Server();
    const socket = io(server);

    socket.on('connection', (client) => {
        client.on('attach', (id) => {
            if (typeof id !== 'string' || id.length > 50) {
                newPlayer(state, client);
                return;
            }
            attach(state, client, id);
        });

        client.on('new', () => {
            newPlayer(state, client);
        });

        client.on('disconnect', () => {
            disconnectClientLater(state, client);
        });

        let player;
        client.on('command', ({command, argument}) => {
            if (!player) {
                for (const other of state.players.list) {
                    if (other.client === client) {
                        player = other;
                        break;
                    }
                }
                if (!player) return;
            }
            handle(state, `player_${command}`, {player, argument});
        });
    });

    server.listen(3000);
});
