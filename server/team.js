const {addHandler, handle} = require('skid/lib/event');

addHandler('load', (state) => {
    state.teams = {};
    state.teams.a = {participants: []};
    state.teams.b = {participants: []};
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
