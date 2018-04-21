const {addHandler, handle} = require('skid/lib/event');
const {playerHandle} = require('./player');

addHandler('load', (state) => {
    const width = 10;
    const height = 10;
    state.overworld = {width, height, owners: {}};
    for (let y = 0; y <= height; y += 1) {
        for (let x = 0; x <= width; x += 1) {
            let owner = 'b';
            if (x < 5) owner = 'a';
            state.overworld.owners[`${x},${y}`] = owner;
        }
    }
});

addHandler('player_onteam', (state, player) => {
    player.view = 'overworld';
    playerHandle(player, 'overworld', state.overworld);
});
