// hero-3d.js ───────────────────────────────────────────────────────────────

function init3DScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.add(new THREE.AmbientLight(0x404040, 0.3));

    const dir = new THREE.DirectionalLight(0xf97316, 1);
    dir.position.set(5, 5, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    scene.add(dir);

    const pt = new THREE.PointLight(0xfb923c, 0.8, 100);
    pt.position.set(-5, 3, -5);
    scene.add(pt);

    createAdvancedModel();
    createParticleSystem();

    camera.position.set(0, 1, 8);

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    animate();
}

function createAdvancedModel() {
    const g = new THREE.Group();
    createInteractiveDeveloperWorkspace(g);
    createFloatingElements(g);
    heroModel = g;
    scene.add(g);
}

function createInteractiveDeveloperWorkspace(group) {

    const desk = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.1, 2.5),
        new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 })
    );
    desk.position.y = -1;
    desk.userData = { type: 'desk' };
    group.add(desk);

    for (let i = 0; i < 3; i++) {

        const monitor = createMonitorModel({
            screenWidth: 2,
            screenHeight: 1.2,
            glowIntensity: 0.4,
            theme: document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
            position: {
                x: (i - 1) * 2.2,
                y: 0.2,
                z: -0.6
            }
        });

        if (i !== 1) {
            monitor.rotation.y = i === 0 ? 0.3 : -0.3;
        }

        monitor.userData = {
            type: 'monitor',
            pulseSpeed: 0.02 + i * 0.01
        };

        group.add(monitor);

        const screen = monitor.getObjectByName('screen');

        for (let j = 0; j < 8; j++) {

            const lineWidth = 0.6 + Math.random() * 0.9;

            const line = new THREE.Mesh(
                new THREE.PlaneGeometry(lineWidth, 0.05),
                new THREE.MeshBasicMaterial({
                    color: i === 1 ? 0xf97316 : (i === 0 ? 0x10b981 : 0xfb923c),
                    transparent: true,
                    opacity: 0.6 + Math.random() * 0.4
                })
            );

            const screenRightEdge = screen.geometry.parameters.width / 2;

            line.position.set(
                screenRightEdge - lineWidth / 2 - 0.05,
                (j - 4) * 0.08,
                0.06
            );

            line.userData = {
                type: 'codeLine'
            };

            screen.add(line);
        }
    }

    const keyboard = createKeyboardModel({
        width: 2.8,
        height: 0.12,
        depth: 0.6,
        position: { x: 0, y: -0.65, z: 0.8 },
        theme: document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
        rgbEnabled: true
    });

    keyboard.userData = { type: "keyboardModel" };
    group.add(keyboard);

    const heroMouse = createMouseModel({
        position: { x: 2, y: -0.68, z: 0.8 },
        rgbEnabled: true
    });

    heroMouse.userData = {
        type: 'mouse',
        pulseSpeed: 0.03
    };

    group.add(heroMouse);

    const heroCPU = createCPUModel({
        position: { x: -3, y: -0.2, z: 0 },
        rgbEnabled: true
    });

    group.add(heroCPU);

    for (let i = 0; i < 50; i++) {
        const p = new THREE.Mesh(
            new THREE.SphereGeometry(0.02, 4, 4),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
                transparent: true, opacity: 0.8
            })
        );

        const r = 2 + Math.random() * 4;
        const a = Math.random() * Math.PI * 2;
        const h = (Math.random() - 0.5) * 3;

        p.position.set(Math.cos(a) * r, h, Math.sin(a) * r);
        p.userData = {
            type: 'dataParticle',
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.02
            },
            life: Math.random() * 100,
            maxLife: 100 + Math.random() * 50
        };
        group.add(p);
    }

    const ring = new THREE.Mesh(
        new THREE.RingGeometry(3, 7, 32),
        new THREE.MeshPhysicalMaterial({
            color: 0x6366f1, metalness: 0.1, roughness: 0.9,
            transparent: true, opacity: 0.2,
            emissive: 0x6366f1, emissiveIntensity: 0.3,
            side: THREE.DoubleSide
        })
    );
    ring.position.y = -2;
    ring.rotation.x = -Math.PI / 2;
    ring.userData = { type: 'codeStructure', rotationSpeed: 0.003, pulseSpeed: 0.02 };
    group.add(ring);
}

function createFloatingElements(group) {
    for (let i = 0; i < 20; i++) {
        const p = new THREE.Mesh(
            new THREE.SphereGeometry(0.03, 8, 8),
            new THREE.MeshPhysicalMaterial({
                color: Math.random() > 0.5 ? 0x6366f1 : 0x8b5cf6,
                metalness: 0.1, roughness: 0.1,
                transparent: true, opacity: 0.7,
                emissive: Math.random() > 0.5 ? 0x6366f1 : 0x8b5cf6,
                emissiveIntensity: 0.6
            })
        );

        p.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 8
        );

        p.userData = {
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };

        group.add(p);
    }
}

function createParticleSystem() {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 20;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const c = new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 0.7, 0.6);
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geo, mat);
    scene.add(particleSystem);
}

function onMouseMove(e) {
    mouseX = (e.clientX / innerWidth) * 2 - 1;
    mouseY = -(e.clientY / innerHeight) * 2 + 1;
}

function onWindowResize() {
    const c = document.getElementById('hero-canvas');
    if (!c) return;
    camera.aspect = c.clientWidth / c.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(c.clientWidth, c.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);

    if (heroModel) {
        const t = Date.now() * 0.001;

        heroModel.children.forEach((child, idx) => {
            const d = child.userData;
            if (!d) return;

            switch (d.type) {
                case 'desk':
                    child.position.y = -1 + Math.sin(t * 0.3) * 0.02;
                    break;

                case 'monitor':
                    const screen = child.getObjectByName('screen');
                    if (screen && screen.material) {
                        screen.material.emissiveIntensity =
                            Math.sin(t * d.pulseSpeed * 3) * 0.2 + 0.6;
                    }
                    break;

                case 'keyboardModel':
                    if (Math.random() < 0.002) {
                        animateKeyPress(child, 'spacebar');
                    }
                    break;

                case 'mouse':
                    const wheel = child.getObjectByName('scrollWheel');
                    if (wheel && wheel.material) {
                        wheel.material.emissiveIntensity =
                            Math.sin(t * d.pulseSpeed * 4) * 0.2 + 0.3;
                    }
                    break;

                case 'cpuFan':
                    child.rotation.z += child.userData.speed;
                    break;

                case 'dataParticle':
                    child.position.addScaledVector(d.velocity, 1);
                    d.life--;
                    if (d.life <= 0) {
                        const r = 2 + Math.random() * 4;
                        const a = Math.random() * Math.PI * 2;
                        child.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 3, Math.sin(a) * r);
                        d.life = d.maxLife;
                    }
                    child.material.color.setHSL((t * 0.5 + idx * 0.1) % 1, 1, 0.5);
                    break;

                case 'codeStructure':
                    child.rotation.z += d.rotationSpeed;
                    const p = Math.sin(t * d.pulseSpeed * 2) * 0.2 + 0.4;
                    child.material.emissiveIntensity = p;
                    child.material.opacity = p * 0.5;
                    break;
            }
        });

        heroModel.rotation.y += 0.005;
        heroModel.rotation.x += (mouseY * 0.04 - heroModel.rotation.x) * 0.1;
        heroModel.rotation.y += (mouseX * 0.08 - heroModel.rotation.y) * 0.1;
    }

    if (particleSystem) {
        particleSystem.rotation.y += 0.002;
        particleSystem.rotation.x += 0.001;

        const t = Date.now() * 0.001;
        const pos = particleSystem.geometry.attributes.position.array;

        for (let i = 0; i < pos.length; i += 3) {
            pos[i] += Math.sin(t + i) * 0.01;
            pos[i + 1] += Math.cos(t + i * 0.5) * 0.005;
            pos[i + 2] += Math.sin(t * 0.8 + i) * 0.008;

            if (Math.abs(pos[i]) > 15 || Math.abs(pos[i + 1]) > 15 || Math.abs(pos[i + 2]) > 15) {
                pos[i] = (Math.random() - 0.5) * 20;
                pos[i + 1] = (Math.random() - 0.5) * 20;
                pos[i + 2] = (Math.random() - 0.5) * 20;
            }
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}