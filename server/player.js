const {addHandler, handle} = require('skid/lib/event');

addHandler('load', (state) => {
    state.players = {list: []};
});

function newPlayer(state, client) {
    const id = `${Date.now()}${Math.random()}`;
    client.emit('attached', id);

    const player = {id, client};
    state.players.list.push(player);
    handle(state, 'player_new', player);
}

function attach(state, client, id) {
    for (const player of state.players.list) {
        if (player.id === id) {
            clearTimeout(player.disconnecting);
            player.client.disconnect(true);
            player.client = client;
            client.emit('attached', id);
            handle(state, 'player_reconnect', player);
            return;
        }
    }

    const player = {id, client};
    state.players.list.push(player);
    handle(state, 'player_new', player);
}

function disconnect(state, player) {
    for (let i = 0; i < state.players.list.length; i += 1) {
        if (player === state.players.list[i]) {
            state.players.list.splice(i, 1);
        }
    }
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

addHandler('server_start', (state, socket) => {
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
    });
});
