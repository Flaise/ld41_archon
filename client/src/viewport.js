const {Viewport} = require('skid/lib/scene/viewport');
const {ClearAll} = require('skid/lib/scene/clear-all');
const {Smoothing} = require('skid/lib/scene/smoothing');
const {Camera} = require('skid/lib/scene/camera');
const {Group} = require('skid/lib/scene/group');
const {addHandler} = require('skid/lib/event');

addHandler('load', (session) => {
    const renderer = new Viewport();
    renderer.canvas = canvas;

    const clearAll = new ClearAll(renderer);
    const smoothing = new Smoothing(renderer, true);

    const camera = new Camera(smoothing);
    camera.w.setTo(1);
    camera.h.setTo(.75);

    const world = new Group(camera);
    const ui = new Group(camera);

    session.scene = {world, camera, ui};
});
