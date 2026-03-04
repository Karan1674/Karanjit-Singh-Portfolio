// cpu.js ─────────────────────────────────────────

function createCPUModel(options = {}) {
    const {
        width = 0.6,
        height = 1.4,
        depth = 0.65,
        position = { x: -1.6, y: -0.1, z: -0.3 },
        rgbEnabled = true
    } = options;

    const isLight =
        document.documentElement.getAttribute("data-theme") === "light";

    const bodyColor = isLight ? 0x1a1a1a : 0x0f0f0f;
    const accentColor = 0xfe462e;

    const cpuGroup = new THREE.Group();
    cpuGroup.name = "cpuModel";

    const pcCase = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshPhysicalMaterial({
            color: bodyColor,
            metalness: 0.9,
            roughness: 0.25,
            clearcoat: 0.4
        })
    );

    pcCase.castShadow = true;
    pcCase.receiveShadow = true;
    pcCase.name = "pcCase";
    cpuGroup.add(pcCase);


    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, height - 0.2, depth - 0.15),
        new THREE.MeshPhysicalMaterial({
            color: 0x111111,
            roughness: 0.05,
            transmission: 0.9,
            transparent: true,
            opacity: 0.35,
            thickness: 0.4
        })
    );

    glass.position.x = width / 2 - 0.01;
    glass.name = "glassPanel";
    cpuGroup.add(glass);

    const fanCount = 3;
    const fanRadius = 0.12;

    for (let i = 0; i < fanCount; i++) {

        const fanGroup = new THREE.Group();
        fanGroup.name = `fan_${i}`;

        const frame = new THREE.Mesh(
            new THREE.TorusGeometry(fanRadius, 0.01, 16, 32),
            new THREE.MeshPhysicalMaterial({
                color: 0x1a1a1a,
                metalness: 0.8,
                roughness: 0.3
            })
        );

        fanGroup.add(frame);

        if (rgbEnabled) {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(fanRadius - 0.02, 0.008, 16, 32),
                new THREE.MeshBasicMaterial({
                    color: accentColor,
                    transparent: true,
                    opacity: isLight ? 0.7 : 0.9
                })
            );

            ring.name = "rgbRing";
            fanGroup.add(ring);

            const light = new THREE.PointLight(
                accentColor,
                isLight ? 0.4 : 0.6,
                0.8
            );

            fanGroup.add(light);
        }

        fanGroup.position.set(
            0,
            height / 2 - 0.3 - i * 0.35,
            depth / 2 + 0.02
        );

        fanGroup.userData = {
            type: "cpuFan",
            speed: 0.05 + i * 0.01
        };

        cpuGroup.add(fanGroup);
    }


    const gpu = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.12, 0.05),
        new THREE.MeshPhysicalMaterial({
            color: 0x1a1a1a,
            metalness: 0.8,
            roughness: 0.3,
            emissive: accentColor,
            emissiveIntensity: 0.25
        })
    );

    gpu.position.set(0.1, -0.1, 0);
    gpu.rotation.y = Math.PI / 2;
    gpu.name = "gpu";
    cpuGroup.add(gpu);

    const powerButton = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.01, 16),
        new THREE.MeshPhysicalMaterial({
            color: accentColor,
            emissive: accentColor,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        })
    );

    powerButton.rotation.x = Math.PI / 2;
    powerButton.position.set(
        0,
        height / 2 - 0.1,
        depth / 2 + 0.01
    );

    powerButton.name = "powerButton";
    cpuGroup.add(powerButton);

    cpuGroup.position.set(position.x, position.y, position.z);

    return cpuGroup;
}