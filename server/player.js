const {addHandler, handle} = require('skid/lib/event');

addHandler('load', (state) => {
    state.players = {list: []};
});

function newPlayer(state, client) {
    const id = `${Date.now()}${Math.random()}`;
    client.emit('attached', id);

    const player = {id, client};
    state.players.list.push(player);
    console.log('players:', state.players.list.length);
}

function attach(state, client, id) {
    for (const player of state.players.list) {
        if (player.id === id) {
            player.client.disconnect(true);
            player.client = client;
            client.emit('attached', id);
            console.log('reattached');
            return;
        }
    }

    const player = {id, client};
    state.players.list.push(player);
    console.log('players:', state.players.list.length);
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

            // for (let i = 0; i < state.players.list.length; i += 1) {
            //     if (state.players.list[i].client === client) {
            //         state.players.list.splice(i, 1);
            //     }
            // }
            // console.log('players:', state.players.list.length);

            // TODO: Remove player object on manual exit or after timeout
        });
    });
});
