const {addHandler} = require('skid/lib/event');
const {linear} = require('skid/lib/tween');
const {PieAvatar} = require('skid/lib/scene/pie-avatar');
const {Translation} = require('skid/lib/scene/translation');

addHandler('load', (state) => {
    const root = new Translation(state.overworld.hud); // TODO: Shouldn't be overworld.hud

    const pieOffset = new Translation(root);
    pieOffset.x.setTo(.08)
    pieOffset.y.setTo(.08);

    const pie = new PieAvatar(pieOffset);
    pie.fillStyle = '#202020';
    pie.opacity.setTo(.6);
    pie.w.setTo(.08);
    pie.h.setTo(.08);

    state.overworld.timer = pie;
});

addHandler('overworld_timer', (state, delay) => {
    const pie = state.overworld.timer;
    pie.breadth.setTo(-1);
    pie.breadth.modTo(0, delay, linear);
});
