const {addHandler, handle} = require('skid/lib/event');
const {playerHandle} = require('./player');

addHandler('load', (state) => {
    const width = 10;
    const height = 10;
    state.overworld = {width, height, owners: {}};
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            let owner = 'b';
            if (x < 5) owner = 'a';
            state.overworld.owners[`${x},${y}`] = owner;
        }
    }
});

function sendOverworld(state, player) {
    const teamA = [];
    const teamB = [];

    for (const player of state.players.list) {
        if (player.overworld.position && player.team) {
            if (player.team.id === 'a') {
                teamA.push(player.overworld.position);
            } else {
                teamB.push(player.overworld.position);
            }
        }
    }

    playerHandle(player, 'overworld', {
        width: state.overworld.width,
        height: state.overworld.height,
        owners: state.overworld.owners,
        teamA, teamB,
    });
}

function sendOverworldToAll(state) {
    const teamA = [];
    const teamB = [];

    for (const player of state.players.list) {
        if (player.overworld.position && player.team) {
            if (player.team.id === 'a') {
                teamA.push(player.overworld.position);
            } else {
                teamB.push(player.overworld.position);
            }
        }
    }

    const message = {
        width: state.overworld.width,
        height: state.overworld.height,
        owners: state.overworld.owners,
        teamA, teamB,
    };

    for (const player of state.players.list) {
        if (player.view === 'overworld') {
            playerHandle(player, 'overworld', message);
        }
    }
}

addHandler('player_new', (state, player) => {
    player.overworld = {};
});

addHandler('player_onteam', (state, player) => {
    player.view = 'overworld';
    const key = randomFriendlySquareKey(state, player.team);
    const position = keyToXY(key);
    player.overworld.position = position;
    sendOverworldToAll(state);
});

addHandler('player_end', (state, player) => {
    sendOverworldToAll(state);
});

function ownedByTeam(state, team) {
    const result = [];
    for (const key of Object.keys(state.overworld.owners)) {
        if (state.overworld.owners[key] === team.id) {
            result.push(key);
        }
    }
    return result;
}

function randomFriendlySquareKey(state, team) {
    const options = ownedByTeam(state, team);
    if (!options.length) return undefined;
    const index = Math.floor(Math.random() * options.length);
    return options[index];
}

function keyToXY(key) {
    let [x, y] = key.split(',');
    x = Number.parseInt(x);
    y = Number.parseInt(y);
    return {x, y};
}

addHandler('player_reconnect', (state, player) => {
    if (player.view === 'overworld') {
        sendOverworld(state, player);
    }
});
