// keyboard.js ─────────────────────────────────────────


function createKeyboardModel(options = {}) {
    const {
        width = 2.8,
        height = 0.12,
        depth = 0.6,
        position = { x: 0, y: -0.65, z: 0.8 },
        rgbEnabled = true
    } = options;

    const isLight =
        document.documentElement.getAttribute("data-theme") === "light";

    const baseColor = isLight ? 0x2a2a2a : 0x1a1a1a;
    const plateColor = isLight ? 0x1a1a1a : 0x0f0f0f;
    const accentColor = 0xfe462e;

    const keyboardGroup = new THREE.Group();
    keyboardGroup.name = "keyboardModel";

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(width, height * 0.4, depth),
        new THREE.MeshPhysicalMaterial({
            color: baseColor,
            metalness: 0.8,
            roughness: 0.3,
            clearcoat: 0.4
        })
    );

    base.castShadow = true;
    base.receiveShadow = true;
    base.name = "keyboardBase";
    keyboardGroup.add(base);

    const plate = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.05, height * 0.2, depth - 0.05),
        new THREE.MeshPhysicalMaterial({
            color: plateColor,
            metalness: 0.9,
            roughness: 0.2
        })
    );

    plate.position.y = height * 0.3;
    plate.castShadow = true;
    plate.receiveShadow = true;
    plate.name = "keyboardPlate";
    keyboardGroup.add(plate);

    const keyWidth = 0.075;
    const keyHeight = height * 0.5;
    const keyDepth = 0.075;
    const spacing = 0.05;

    const keysPerRow = 18;
    const rows = 6;

    const keyGeometry = new THREE.BoxGeometry(keyWidth, keyHeight, keyDepth);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < keysPerRow; col++) {

            const keyMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x2a2a2a,
                metalness: 0.3,
                roughness: 0.5,
                clearcoat: 0.8
            });

            const key = new THREE.Mesh(keyGeometry, keyMaterial);

            key.position.set(
                (col - keysPerRow / 2) * (keyWidth + spacing),
                height * 0.55,
                (row - rows / 2) * (keyDepth + spacing)
            );

            key.castShadow = true;
            key.receiveShadow = true;
            key.name = `key_${row}_${col}`;

            keyboardGroup.add(key);
        }
    }

    const spacebar = new THREE.Mesh(
        new THREE.BoxGeometry(keyWidth * 5, keyHeight, keyDepth),
        new THREE.MeshPhysicalMaterial({
            color: accentColor,
            metalness: 0.4,
            roughness: 0.4,
            clearcoat: 0.9
        })
    );

    spacebar.position.set(
        0,
        height * 0.55,
        (rows / 2 - 1) * (keyDepth + spacing)
    );

    spacebar.name = "spacebar";
    spacebar.castShadow = true;
    keyboardGroup.add(spacebar);

    const enterKey = new THREE.Mesh(
        new THREE.BoxGeometry(keyWidth * 2, keyHeight, keyDepth),
        new THREE.MeshPhysicalMaterial({
            color: accentColor,
            metalness: 0.4,
            roughness: 0.4,
            clearcoat: 0.9
        })
    );

    enterKey.position.set(
        (keysPerRow / 2 - 2) * (keyWidth + spacing),
        height * 0.55,
        (-rows / 2 + 1) * (keyDepth + spacing)
    );

    enterKey.name = "enterKey";
    enterKey.castShadow = true;
    keyboardGroup.add(enterKey);

    if (rgbEnabled) {

        const underglow = new THREE.Mesh(
            new THREE.BoxGeometry(width - 0.1, 0.02, depth - 0.1),
            new THREE.MeshBasicMaterial({
                color: accentColor,
                transparent: true,
                opacity: isLight ? 0.4 : 0.7
            })
        );

        underglow.position.y = -height * 0.3;
        underglow.name = "underglow";
        keyboardGroup.add(underglow);

        const light1 = new THREE.PointLight(accentColor, 0.4, 1);
        light1.position.set(-width / 3, -height * 0.2, 0);
        keyboardGroup.add(light1);

        const light2 = new THREE.PointLight(accentColor, 0.4, 1);
        light2.position.set(width / 3, -height * 0.2, 0);
        keyboardGroup.add(light2);
    }

    keyboardGroup.rotation.x = -0.05;

    keyboardGroup.position.set(position.x, position.y, position.z);

    return keyboardGroup;
}



function animateKeyPress(keyboardModel, keyName = "spacebar") {
    const key = keyboardModel.getObjectByName(keyName);
    if (!key) return;

    const originalY = key.position.y;

    gsap.timeline()
        .to(key.position, {
            y: originalY - 0.02,
            duration: 0.05,
            ease: "power2.in"
        })
        .to(key.position, {
            y: originalY,
            duration: 0.1,
            ease: "power2.out"
        });
}