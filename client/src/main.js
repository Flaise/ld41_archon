
require('./network');
require('./viewport');
require('./preloader');
require('./overworld');
require('./overworld_input');
require('./overworld_timer');
require('./fight');
require('skid/lib/input'); // NOTE: makes 'key' events fire
const {start} = require('skid/lib/load');

start(true);
