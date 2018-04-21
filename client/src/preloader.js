const {PieAvatar} = require('skid/lib/scene/pie-avatar');
const {Translation} = require('skid/lib/scene/translation');
const {TextAvatar} = require('skid/lib/scene/text-avatar');
const {load} = require('skid/lib/load');
const {addHandler, handle} = require('skid/lib/event');

addHandler('load', (state) => {
    const meter = new PieAvatar(state.scene.hudCamera);
    meter.x.setTo(.5);
    meter.y.setTo(.75 / 2);
    meter.w.setTo(.03);
    meter.h.setTo(.03);
    meter.fillStyle = 'black';
    meter.innerRadiusRel.setTo(.6);

    const textPosition = new Translation(state.scene.hudCamera);
    textPosition.x.setTo(.5);
    textPosition.y.setTo(.75 / 2 + .032);

    const text = new TextAvatar(textPosition, state.scene.hudCamera);
    text.textAlign = 'center';
    text.textBaseline = 'top';
    text.fillStyle = 'black';
    text.font = '18px verdana';
    text.text = 'Loading...';

    state.preloader = {meter, textPosition, text};
});

addHandler('load_progress', (state, progress) => {
    state.preloader.meter.breadth.setTo(-progress);
});

addHandler('load_error', (state) => {
    state.preloader.meter.fillStyle = '#b00';
    state.preloader.text.fillStyle = '#b00';
    state.preloader.text.text = `Error`;
});

addHandler('load_done', (state) => {
    state.preloader.meter.remove();
    state.preloader.textPosition.remove();
});
