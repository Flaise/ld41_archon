const {addHandler, handle} = require('skid/lib/event');
const {playerHandle} = require('./player');

const MOVE_INTERVAL = 3000;

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

addHandler('load_done', (state) => {
    state.overworld.updateInterval = setInterval(() => {
        handle(state, 'overworld_update');
    }, MOVE_INTERVAL);
});

addHandler('player_west', (state, {player, argument}) => {
    if (!argument) return;
    if (player.view === 'overworld') player.overworld.heading = 'west';
});
addHandler('player_east', (state, {player, argument}) => {
    if (!argument) return;
    if (player.view === 'overworld') player.overworld.heading = 'east';
});
addHandler('player_north', (state, {player, argument}) => {
    if (!argument) return;
    if (player.view === 'overworld') player.overworld.heading = 'north';
});
addHandler('player_south', (state, {player, argument}) => {
    if (!argument) return;
    if (player.view === 'overworld') player.overworld.heading = 'south';
});

addHandler('overworld_update', (state) => {
    let changed = false;
    for (const player of state.players.list) {
        if (player.view !== 'overworld') continue;
        if (!player.overworld.position) {
            const key = randomFriendlySquareKey(state, player.team);
            const position = keyToXY(key);
            player.overworld.position = position;
            playerHandle(player, 'overworld_self', position);
            changed = true;
        } else if (player.overworld.heading) {
            const heading = player.overworld.heading;
            if (heading === 'east') {
                move(state, player, {x: 1, y: 0});
            } else if (heading === 'west') {
                move(state, player, {x: -1, y: 0});
            } else if (heading === 'north') {
                move(state, player, {x: 0, y: -1});
            } else if (heading === 'south') {
                move(state, player, {x: 0, y: 1});
            }
            player.overworld.heading = undefined;
            changed = true;
        } else {
            changed = transmute(state, player) || changed;
        }
    }
    if (changed) sendOverworldToAll(state);
    handle(state, 'overworld_update_done');
    sendTimerToAll(state);
});

function transmute(state, player) {
    const key = xyToKey(player.overworld.position);
    if (state.overworld.owners[key] === player.team.id) return false;
    state.overworld.owners[key] = player.team.id;
    return true;
}

function move(state, player, delta) {
    if (!player.overworld.position) return;
    let {x, y} = player.overworld.position;
    x += delta.x;
    y += delta.y;
    if (x >= state.overworld.width) return;
    if (x < 0) return;
    if (y >= state.overworld.height) return;
    if (y < 0) return;
    player.overworld.position.x = x;
    player.overworld.position.y = y;
    playerHandle(player, 'overworld_self', {x, y});
}

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

function sendTimerToAll(state) {
    for (const player of state.players.list) {
        if (player.view === 'overworld') {
            playerHandle(player, 'overworld_timer', MOVE_INTERVAL);
        }
    }
}

addHandler('player_new', (state, player) => {
    player.overworld = {heading: undefined, position: undefined};
});

addHandler('player_onteam', (state, player) => {
    player.view = 'overworld';
    sendOverworld(state, player);
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

function xyToKey({x, y}) {
    return `${x},${y}`;
}

addHandler('player_reconnect', (state, player) => {
    if (player.view === 'overworld') {
        sendOverworld(state, player);
        playerHandle(player, 'overworld_self', player.overworld.position);
    }
});
