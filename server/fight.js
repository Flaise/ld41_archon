const {addHandler, handle} = require('skid/lib/event');
const {playerHandle} = require('./player');

addHandler('load', (state) => {
    state.fight = {arenas: []};
});

addHandler('player_new', (state, player) => {
    player.fight = {position: undefined, arena: undefined};
});

addHandler('overworld_update_done', (state) => {
    const players = [];
    for (const player of state.players.list) {
        if (player.view === 'overworld' && player.overworld.position) players.push(player);
    }

    for (let i = 0; i < players.length; i += 1) {
        const player1 = players[i];
        for (let j = i + 1; j < players.length; j += 1) {
            const player2 = players[j];

            if (player1.team === player2.team) continue;
            const {x, y} = player1.overworld.position;
            if (x !== player2.overworld.position.x) continue;
            if (y !== player2.overworld.position.y) continue;

            const arena = arenaOfXY(state, x, y);
            enterFight(arena, player1);
            enterFight(arena, player2);
        }
    }
});

function arenaOfXY(state, x, y) {
    for (const arena of state.fight.arenas) {
        if (arena.x === x && arena.y === y) return arena;
    }
    const result = {x, y, players: []};
    state.fight.arenas.push(result);
    return result;
}

function serializePlayer(player) {
    if (!player.fight.position) return undefined;
    const {x, y} = player.fight.position;
    return {x, y, code: player.remoteCode, team: player.team.id};
}

function enterFight(arena, player) {
    if (player.view !== 'fight') {
        player.view = 'fight';
        player.fight.arena = arena;
        const x = 0; // TODO
        const y = 0;
        player.fight.position = {x, y};
        sendFight(arena, player);
        const serialized = serializePlayer(player);
        for (const other of arena.players) {
            playerHandle(other, 'fight_character', serialized);
        }
        arena.players.push(player);
        playerHandle(player, 'fight_self', serialized);
    }
}

function sendFight(arena, player) {
    const data = [];
    for (const other of arena.players) {
        data.push(serializePlayer(other));
    }
    playerHandle(player, 'fight', data);
}

addHandler('player_reconnect', (state, player) => {
    if (player.view === 'fight') {
        sendFight(player.fight.arena, player);
    }
});
