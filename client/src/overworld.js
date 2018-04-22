const {addHandler, handle} = require('skid/lib/event');
const {Camera} = require('skid/lib/scene/camera');
const {Group} = require('skid/lib/scene/group');
const {ComputedTileField} = require('skid/lib/scene/computed-tile-field');
const {IconAvatar} = require('skid/lib/scene/icon-avatar');
const {loadIcon} = require('skid/lib/scene/icon');
const {Opacity} = require('skid/lib/scene/opacity');

addHandler('load', (state) => {
    const tileA = loadIcon(state, './assets/tile_a.png', 64, 64, 128, 32452);
    const tileB = loadIcon(state, './assets/tile_b.png', 64, 64, 128, 30468);
    const characterA = loadIcon(state, './assets/character_a.png', 20, 29, 58, 664);
    const characterB = loadIcon(state, './assets/character_b.png', 32, 32, 64, 1035);

    const opacity = new Opacity(state.scene.smoothing, 0);
    opacity.layer = 1;
    const camera = new Camera(opacity);
    const terrain = new Group(camera);
    const characters = new Group(camera);
    const worldHud = new Group(camera);
    const width = 0;
    const height = 0;
    const owners = {};
    const field = new ComputedTileField(terrain, 100);
    state.overworld = {width, height, owners, camera, field, characters, worldHud, opacity,
                       tileA, tileB, characterA, characterB};
});

addHandler('connect', (state) => {
    state.overworld.field.clear();
    state.overworld.characters.clear();
    state.overworld.worldHud.clear();
});

addHandler('overworld', (state, {width, height, owners, teamA, teamB}) => {
    state.overworld.opacity.alpha.setTo(1);
    state.overworld.field.clear();
    state.overworld.characters.clear();

    state.overworld.width = width;
    state.overworld.height = height;
    state.overworld.owners = owners;
    state.view = 'overworld';

    state.overworld.camera.x.setTo(width / 2 - .5);
    state.overworld.camera.y.setTo(height / 2 - .5);
    state.overworld.camera.w.setTo(height / .75);
    state.overworld.camera.h.setTo(height);
    state.overworld.camera.anchorX.setTo(.5);
    state.overworld.camera.anchorY.setTo(.5);

    for (const key of Object.keys(owners)) {
        const owner = owners[key];
        let [x, y] = key.split(',');
        x = Number.parseInt(x);
        y = Number.parseInt(y);
        let tile;
        if (owner === 'a') {
            tile = state.overworld.tileA;
        } else {
            tile = state.overworld.tileB;
        }
        state.overworld.field.makeTile(tile, x, y, 0, 0);
    }

    for (const {x, y} of teamA) {
        const avatar = new IconAvatar(state.overworld.characters, state.overworld.characterA, x, y, 1, 1);
    }
    for (const {x, y} of teamB) {
        const avatar = new IconAvatar(state.overworld.characters, state.overworld.characterB, x, y, 1, 1);
    }
});

addHandler('fight', (state) => {
    state.overworld.opacity.alpha.setTo(0);
});
