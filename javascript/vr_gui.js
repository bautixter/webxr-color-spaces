import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { HTMLMesh } from 'three/addons/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/addons/interactive/InteractiveGroup.js';

/**
 * Create a lil-gui instance wired for both desktop and WebXR VR sessions.
 * Returns the GUI — caller adds their own controls to it.
 *
 * @param {object} ctx  - { renderer, scene, camera, controls, controller1, controller2 }
 * @param {object} opts - { width, position, rotation, scale }
 */
export function createGui(
    { renderer, scene, camera, controls, controller1, controller2 },
    {
        width    = 300,
        position = [0, 3, 4.2],
        rotation = [-Math.PI / 4, 0, 0],
        scale    = 2,
    } = {}
) {
    const gui = new GUI({ width });

    const guiMesh = new HTMLMesh(gui.domElement);
    guiMesh.position.set(...position);
    guiMesh.rotation.set(...rotation);
    guiMesh.scale.setScalar(scale);

    const group = new InteractiveGroup();
    group.listenToXRControllerEvents(controller1);
    group.listenToXRControllerEvents(controller2);
    scene.add(group);

    renderer.xr.addEventListener('sessionstart', () => {
        controls.enabled = false;
        group.listenToPointerEvents(renderer, camera);
        group.add(guiMesh);
        gui.domElement.style.visibility = 'hidden';
    });

    renderer.xr.addEventListener('sessionend', () => {
        controls.enabled = true;
        gui.domElement.style.visibility = 'visible';
        group.remove(guiMesh);
    });

    return gui;
}
