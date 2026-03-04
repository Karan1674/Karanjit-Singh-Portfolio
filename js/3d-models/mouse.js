// mouse.js ─────────────────────────────────────────


function createMouseModel(options = {}) {
    const {
        position = { x: 2, y: -0.68, z: 0.8 },
        rgbEnabled = true
    } = options;

    const isLight =
        document.documentElement.getAttribute("data-theme") === "light";

    const bodyColor = isLight ? 0x2a2a2a : 0x1a1a1a;
    const buttonColor = isLight ? 0x3a3a3a : 0x252525;
    const accentColor = 0xfe462e;

    const mouseGroup = new THREE.Group();
    mouseGroup.name = "mouseModel";


    const bodyGeometry = new THREE.SphereGeometry(0.14, 32, 32);
    bodyGeometry.scale(1, 0.7, 1.4);

    const body = new THREE.Mesh(
        bodyGeometry,
        new THREE.MeshPhysicalMaterial({
            color: bodyColor,
            metalness: 0.5,
            roughness: 0.35,
            clearcoat: 0.8
        })
    );

    body.castShadow = true;
    body.receiveShadow = true;
    body.name = "mouseBody";
    mouseGroup.add(body);

    const leftButton = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.02, 0.15),
        new THREE.MeshPhysicalMaterial({
            color: buttonColor,
            metalness: 0.4,
            roughness: 0.4
        })
    );

    leftButton.position.set(-0.04, 0.09, -0.05);
    leftButton.name = "leftButton";
    mouseGroup.add(leftButton);


    const rightButton = leftButton.clone();
    rightButton.position.x = 0.04;
    rightButton.name = "rightButton";
    mouseGroup.add(rightButton);


    const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.06, 16),
        new THREE.MeshPhysicalMaterial({
            color: accentColor,
            metalness: 0.7,
            roughness: 0.3,
            emissive: accentColor,
            emissiveIntensity: 0.25
        })
    );

    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(0, 0.11, -0.04);
    wheel.name = "scrollWheel";
    mouseGroup.add(wheel);

    if (rgbEnabled) {
        const logo = new THREE.Mesh(
            new THREE.CircleGeometry(0.03, 32),
            new THREE.MeshBasicMaterial({
                color: accentColor,
                transparent: true,
                opacity: isLight ? 0.6 : 0.85
            })
        );

        logo.rotation.x = -Math.PI / 2;
        logo.position.set(0, 0.1, 0.08);
        logo.name = "rgbLogo";
        mouseGroup.add(logo);

        const rgbLight = new THREE.PointLight(
            accentColor,
            isLight ? 0.4 : 0.7,
            0.6
        );
        rgbLight.position.set(0, 0.12, 0.08);
        mouseGroup.add(rgbLight);
    }


    mouseGroup.rotation.y = Math.PI / 12;
    mouseGroup.position.set(position.x, position.y, position.z);

    return mouseGroup;
}



function animateMouseClick(mouseModel, button = "left") {
    if (!mouseModel) return;

    const target =
        mouseModel.getObjectByName(
            button === "left" ? "leftButton" : "rightButton"
        );

    if (!target) return;

    const originalY = target.position.y;

    gsap.timeline()
        .to(target.position, {
            y: originalY - 0.01,
            duration: 0.05,
            ease: "power2.in"
        })
        .to(target.position, {
            y: originalY,
            duration: 0.1,
            ease: "power2.out"
        });
}