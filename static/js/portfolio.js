let scene, camera, renderer, controls;
let model;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const container = document.getElementById('canvas-container');
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 5);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Get theme from portfolio data
    const theme = document.body.dataset.theme || 'modern';
    createModelBasedOnTheme(theme);

    // Start animation
    animate();
}

function createModelBasedOnTheme(theme) {
    switch (theme) {
        case 'modern':
            const modernGeometry = new THREE.SphereGeometry(1, 32, 32);
            const modernMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x44aa88,
                shininess: 100 
            });
            model = new THREE.Mesh(modernGeometry, modernMaterial);
            break;

        case 'minimal':
            const minimalGeometry = new THREE.BoxGeometry(1, 1, 1);
            const minimalMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x4488aa,
                shininess: 30 
            });
            model = new THREE.Mesh(minimalGeometry, minimalMaterial);
            break;

        case 'creative':
            const creativeGeometry = new THREE.TorusKnotGeometry(0.8, 0.3, 100, 16);
            const creativeMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xaa8844,
                shininess: 60 
            });
            model = new THREE.Mesh(creativeGeometry, creativeMaterial);
            break;

        default:
            const defaultGeometry = new THREE.BoxGeometry(1, 1, 1);
            const defaultMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
            model = new THREE.Mesh(defaultGeometry, defaultMaterial);
    }

    scene.add(model);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate model
    if (model) {
        model.rotation.x += 0.01;
        model.rotation.y += 0.01;
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Initialize the scene
init();
