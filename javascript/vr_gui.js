import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { HTMLMesh } from 'three/addons/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/addons/interactive/InteractiveGroup.js';

/**
 * Creates GUI using Three.JS GUI module (lil-gui) handling AR support.
 */
export function createGui(
    { renderer, scene, camera, controls, controller1, controller2 },
    {
        width          = 300,
        position       = [0, 3, 4.2],
        rotation       = [-Math.PI / 4, 0, 0],
        scale          = 2,
        arGuiPosition  = [0.5, -0.1, -0.5],
        arGuiRotation  = [0, -0.5, 0],
        arGuiScale     = 1.0,
        contentGroup   = null,
        arContentScale = 0.1,
        arContentPos   = [0, -0.3, -0.5],
    } = {}
) {
    renderer.xr.setReferenceSpaceType('local');

    const gui = new GUI({ width });

    // Setup interactive group to use VR gui
    const group = new InteractiveGroup();
    group.listenToXRControllerEvents(controller1);
    group.listenToXRControllerEvents(controller2);
    scene.add(group);

    let savedBackground;
    let guiMesh = null;

    renderer.xr.addEventListener('sessionstart', () => {

        // Remove background
        savedBackground = scene.background;
        scene.background = null;

        // Disable orbit control and enable 
        // if (controls) controls.enabled = false;
        group.listenToPointerEvents(renderer, camera);

        // VR Mesh creation
        guiMesh = new HTMLMesh(gui.domElement);
        guiMesh.position.set(...arGuiPosition);
        guiMesh.rotation.set(...arGuiRotation);
        guiMesh.scale.setScalar(arGuiScale);
        group.add(guiMesh);
        gui.domElement.style.visibility = 'hidden';

        // Resize and locate scene objects
        if (contentGroup) {
            contentGroup.scale.setScalar(arContentScale);
            contentGroup.position.set(...arContentPos);
        }
    });

    renderer.xr.addEventListener('sessionend', () => {
        scene.background = savedBackground;

        if (controls) controls.enabled = true;
        gui.domElement.style.visibility = 'visible';
        if (guiMesh) {
            group.remove(guiMesh);
            guiMesh = null;
        }

        if (contentGroup) {
            contentGroup.scale.setScalar(1);
            contentGroup.position.set(0, 0, 0);
        }
    });

    return gui;
}
