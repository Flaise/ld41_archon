const {addHandler, handle} = require('skid/lib/event');
const {Camera} = require('skid/lib/scene/camera');
const {Group} = require('skid/lib/scene/group');
const {ComputedTileField} = require('skid/lib/scene/computed-tile-field');
const {loadIcon} = require('skid/lib/scene/icon');

addHandler('load', (state) => {
    const tile = loadIcon(state, './assets/tile.png', 50, 50, 100, 3567);

    const camera = new Camera(state.scene.smoothing);
    const terrain = new Group(camera);
    const characters = new Group(camera);
    const width = 0;
    const height = 0;
    const owners = {};
    const field = new ComputedTileField(terrain, 100);
    state.overworld = {width, height, owners, camera, field, tile};
});

addHandler('overworld', (state, {width, height, owners}) => {
    state.overworld.width = width;
    state.overworld.height = height;
    state.overworld.owners = owners;
    state.view = 'overworld';

    state.overworld.camera.x.setTo(width / 2);
    state.overworld.camera.y.setTo(height / 2);
    state.overworld.camera.w.setTo(height / .75);
    state.overworld.camera.h.setTo(height);
    state.overworld.camera.anchorX.setTo(.5);
    state.overworld.camera.anchorY.setTo(.5);

    state.overworld.field.clear();
    for (const key of Object.keys(owners)) {
        const owner = owners[key];
        let [x, y] = key.split(',');
        x = Number.parseInt(x);
        y = Number.parseInt(y);
        session.overworld.field.makeTile(session.overworld.tile, x, y, 0, 0);
    }
});