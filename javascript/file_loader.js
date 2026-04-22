import * as THREE from 'three';

let currentVideo = null;

/**
 * Load an image or video file and call onLoad(texture, width, height).
 */
export function loadFile(file, onLoad) {
    const url = URL.createObjectURL(file);

    if (currentVideo) {
        currentVideo.pause();
        currentVideo.src = '';
        currentVideo = null;
    }

    if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.src = url;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        currentVideo = video;
        video.addEventListener('loadedmetadata', () => {
            video.play();
            const vidTex = new THREE.VideoTexture(video);
            vidTex.minFilter = THREE.NearestFilter;
            vidTex.magFilter = THREE.NearestFilter;
            vidTex.generateMipmaps = false;
            onLoad(vidTex, video.videoWidth, video.videoHeight);
        });
    } else {
        new THREE.TextureLoader().load(url, tex => {
            tex.minFilter = THREE.NearestFilter;
            tex.magFilter = THREE.NearestFilter;
            tex.generateMipmaps = false;
            onLoad(tex, tex.image.width, tex.image.height);
        });
    }
}
