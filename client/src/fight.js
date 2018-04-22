const {addHandler, handle} = require('skid/lib/event');
const {Camera} = require('skid/lib/scene/camera');
const {Group} = require('skid/lib/scene/group');
const {Translation} = require('skid/lib/scene/translation');
const {ComputedTileField} = require('skid/lib/scene/computed-tile-field');
const {IconAvatar} = require('skid/lib/scene/icon-avatar');
const {loadIcon} = require('skid/lib/scene/icon');
const {RectAvatar} = require('skid/lib/scene/rect-avatar');

addHandler('load', (state) => {
    const tileB = loadIcon(state, './assets/tile_b.png', 64, 64, 128, 30468);
    const characterA = loadIcon(state, './assets/character_fight_a.png', 20, 29, 58, 664);
    const characterB = loadIcon(state, './assets/character_fight_b.png', 32, 32, 64, 1035);

    const camera = new Camera(state.scene.smoothing);
    camera.layer = 1;

    camera.x.setTo(8 / 2 - .5);
    camera.y.setTo(8 / 2 - .5);
    camera.w.setTo(8 / .75);
    camera.h.setTo(8);
    camera.anchorX.setTo(.5);
    camera.anchorY.setTo(.5);

    const terrain = new Group(camera);
    const characters = new Group(camera);
    const field = new ComputedTileField(terrain, 100);

    state.fight = {field, tileB, characterA, characterB, entities: {}, characters};
});

addHandler('fight_character fight_self', (state, character) => {
    addCharacter(state, character);
});

addHandler('fight_self', (state, character) => {
    const root = state.fight.entities[character.code].translation;

    const avatar = new RectAvatar(root);
    avatar.w.setTo(1);
    avatar.h.setTo(1);
    avatar.anchorX.setTo(.5);
    avatar.anchorY.setTo(.5);
    avatar.strokeStyle = 'yellow';
    avatar.lineWidth = .05;
    avatar.radius = .15;
});

addHandler('fight', (state, characters) => {
    state.fight.field.clear();
    state.fight.characters.clear();
    state.fight.entities = {};
    state.view = 'fight';

    for (let y = 0; y < 8; y += 1) {
        for (let x = 0; x < 8; x += 1) {
            state.fight.field.makeTile(state.fight.tileB, x, y, 0, 0);
        }
    }

    for (const character of characters) {
        addCharacter(state, character);
    }
});

function addCharacter(state, character) {
    if (!character) return;
    let icon;
    if (character.team === 'a') {
        icon = state.fight.characterA;
    } else if (character.team === 'b') {
        icon = state.fight.characterB;
    }
    const {x, y} = character;
    const translation = new Translation(state.fight.characters);
    translation.x.setTo(x);
    translation.y.setTo(y);
    const avatar = new IconAvatar(translation, icon, 0, 0, 1, 1);
    state.fight.entities[character.code] = {
        ...character,
        avatar,
        translation,
    };
}

const {serverHandle} = require('./network');

addHandler('key', (state, event) => {
    let heading;
    if (event.code === 'ArrowUp' || event.code === 'KeyW') heading = 'north';
    else if (event.code === 'ArrowRight' || event.code === 'KeyD') heading = 'east';
    else if (event.code === 'ArrowDown' || event.code === 'KeyS') heading = 'south';
    else if (event.code === 'ArrowLeft' || event.code === 'KeyA') heading = 'west';
    else return;

    if (state.view === 'fight') {
        serverHandle(heading, event.type === 'keydown');
    }
});
