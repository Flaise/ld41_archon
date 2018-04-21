const {addHandler, handle} = require('skid/lib/event');
const {remove} = require('skid/lib/array');

addHandler('load', (state) => {
    state.teams = {};
    state.teams.a = {participants: [], id: 'a'};
    state.teams.b = {participants: [], id: 'b'};
});

addHandler('player_new', (state, player) => {
    if (state.teams.a.participants.length <= state.teams.b.participants.length) {
        state.teams.a.participants.push(player);
        player.team = state.teams.a;
    } else {
        state.teams.b.participants.push(player);
        player.team = state.teams.b;
    }
    handle(state, 'player_onteam', player);
});

addHandler('player_end', (state, player) => {
    remove(state.teams.a.participants, player);
    remove(state.teams.b.participants, player);
});
