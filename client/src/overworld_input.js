const {addHandler, handle} = require('skid/lib/event');
const {TextAvatar} = require('skid/lib/scene/text-avatar');
const {Opacity} = require('skid/lib/scene/opacity');
const {RectAvatar} = require('skid/lib/scene/rect-avatar');

addHandler('load', (state) => {
    const hud = new Opacity(state.scene.hudCamera, 0);
    hud.layer = 2;

    const text = new TextAvatar(hud, state.scene.hudCamera);
    text.text = 'MOVE WITH ARROW KEYS';
    text.textAlign = 'left';
    text.textBaseline = 'top';
    text.fillStyle = '#ffd';
    text.strokeStyle = 'black';
    text.lineWidth = 4;
    text.font = '27px verdana';
    text.x.setTo(.01);

    state.overworld.hud = hud;
});

addHandler('overworld', (state) => {
    state.overworld.hud.alpha.setTo(1);
});

addHandler('fight', (state) => {
    state.overworld.hud.alpha.setTo(0);
});

addHandler('overworld_self', (state, {x, y}) => {
    state.overworld.worldHud.clear();
    state.overworld.position = {x, y};

    const avatar = new RectAvatar(state.overworld.worldHud);
    avatar.x.setTo(x);
    avatar.y.setTo(y);
    avatar.w.setTo(1);
    avatar.h.setTo(1);
    avatar.anchorX.setTo(.5);
    avatar.anchorY.setTo(.5);
    avatar.strokeStyle = 'yellow';
    avatar.lineWidth = .05;
    avatar.radius = .15;
});

addHandler('overworld_heading', (state, heading) => {
    if (!state.overworld.position) return;

    let message;
    if (heading === 'east') message = '\u2192';
    else if (heading === 'west') message = '\u2190';
    else if (heading === 'north') message = '\u2191';
    else if (heading === 'south') message = '\u2193';

    const text = new TextAvatar(state.overworld.worldHud, state.overworld.camera);
    text.text = message;
    text.textAlign = 'center';
    text.textBaseline = 'top';
    text.fillStyle = '#ddf';
    text.strokeStyle = 'black';
    text.lineWidth = 3;
    text.font = '40px verdana';
    text.x.setTo(state.overworld.position.x);
    text.y.setTo(state.overworld.position.y);
});

const {serverHandle} = require('./network');

addHandler('key', (state, event) => {
    let heading;
    if (event.code === 'ArrowUp' || event.code === 'KeyW') heading = 'north';
    else if (event.code === 'ArrowRight' || event.code === 'KeyD') heading = 'east';
    else if (event.code === 'ArrowDown' || event.code === 'KeyS') heading = 'south';
    else if (event.code === 'ArrowLeft' || event.code === 'KeyA') heading = 'west';
    else return;

    if (state.view === 'overworld') {
        if (event.type === 'keydown') {
            serverHandle(heading, true);
            handle(state, 'overworld_heading', heading);
        }
    }
});
