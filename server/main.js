
require('./player');
require('./overworld');
require('./team'); // Must fire player_onteam after all player_new handlers
const {start} = require('skid/lib/load');

start(true);
