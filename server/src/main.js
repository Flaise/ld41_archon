require('./player');
require('./overworld');
require('./team'); // Must fire player_onteam after all player_new handlers
require('./fight');

const {silence} = require('skid/lib/event');
silence(['overworld_update', 'overworld_update_done', 'fight_update', 'fight_display']);

const {start} = require('skid/lib/load');
start(true);
