const {addHandler} = require('skid/lib/event');
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
    text.x.setTo(10);

    state.overworld.hud = hud;
});

addHandler('overworld', (state) => {
    state.overworld.hud.alpha.setTo(1);
});

addHandler('overworld_self', (state, {x, y}) => {
    state.overworld.worldHud.clear();

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

require('skid/lib/input'); // NOTE: makes 'key' events fire
const {serverHandle} = require('./network');

addHandler('key', (state, event) => {
    if (event.code === 'ArrowUp') serverHandle('north', event.type === 'keydown');
    else if (event.code === 'ArrowRight') serverHandle('east', event.type === 'keydown');
    else if (event.code === 'ArrowDown') serverHandle('south', event.type === 'keydown');
    else if (event.code === 'ArrowLeft') serverHandle('west', event.type === 'keydown');
});
