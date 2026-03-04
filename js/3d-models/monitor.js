// monitor.js ─────────────────────────────────────────

function createMonitorModel(options = {}) {
    const {
        screenWidth = 2,
        screenHeight = 1.2,
        position = { x: 0, y: 0.15, z: -0.5 }
    } = options;

    const isLight =
        document.documentElement.getAttribute("data-theme") === "light";

    const accent = 0xfe462e;
    const bodyColor = 0x111111;

    const monitorGroup = new THREE.Group();
    monitorGroup.name = "monitor";


    const screenMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        metalness: 0.9,
        roughness: isLight ? 0.4 : 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        emissive: accent,
        emissiveIntensity: isLight ? 0.35 : 0.55
    });

    const screen = new THREE.Mesh(
        new THREE.BoxGeometry(screenWidth, screenHeight, 0.05),
        screenMaterial
    );

    screen.castShadow = true;
    screen.receiveShadow = true;
    screen.name = "screen";
    monitorGroup.add(screen);

    const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.15, 0.6, 16),
        new THREE.MeshPhysicalMaterial({
            color: bodyColor,
            metalness: 0.8,
            roughness: 0.3
        })
    );

    stand.position.set(0, -screenHeight / 2 - 0.3, 0);
    monitorGroup.add(stand);

    monitorGroup.position.set(position.x, position.y, position.z);

    return monitorGroup;
}