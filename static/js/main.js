console.log('main.js loaded');

let scene, camera, renderer, controls;
let mixer;
let model;
let clock = new THREE.Clock();

// Initialize scene
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
    renderer.setPixelRatio(window.devicePixelRatio);
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

    // Create a simple cube as default
    createDefaultCube();

    // Start animation
    animate();
}

function createDefaultCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
    model = new THREE.Mesh(geometry, material);
    scene.add(model);
}

function updateModelBasedOnTheme(theme) {
    // Remove existing model
    if (model) {
        scene.remove(model);
    }

    // Create new model based on theme
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
            createDefaultCube();
            return;
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

// Handle form submission
document.getElementById('portfolio-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const theme = formData.get('theme');

    // Update 3D model based on theme
    updateModelBasedOnTheme(theme);

    // Collect experience entries
    const experienceEntries = [];
    document.querySelectorAll('.experience-entry').forEach(entry => {
        experienceEntries.push({
            title: entry.querySelector('input[name="experience[][title]"]').value,
            company: entry.querySelector('input[name="experience[][company]"]').value,
            duration: entry.querySelector('input[name="experience[][duration]"]').value,
            description: entry.querySelector('textarea[name="experience[][description]"]').value
        });
    });

    // Collect project entries
    const projectEntries = [];
    document.querySelectorAll('.project-entry').forEach(entry => {
        projectEntries.push({
            title: entry.querySelector('input[name="projects[][title]"]').value,
            description: entry.querySelector('textarea[name="projects[][description]"]').value
        });
    });

    // Send data to server
    const portfolioData = {
        name: formData.get('name'),
        position: formData.get('position'),
        about: formData.get('about'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        linkedin: formData.get('linkedin'),
        github: formData.get('github'),
        theme: theme,
        experience: experienceEntries,
        projects: projectEntries
    };

    try {
        const response = await fetch('/api/save-portfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(portfolioData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Portfolio saved:', result);
        
        // Redirect to the portfolio page
        if (result.redirect_url) {
            window.location.href = result.redirect_url;
        }
    } catch (error) {
        console.error('Error saving portfolio:', error);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Add experience entry
document.getElementById('add-experience').addEventListener('click', () => {
    const container = document.getElementById('experience-container');
    const newEntry = container.children[0].cloneNode(true);
    newEntry.querySelectorAll('input, textarea').forEach(input => input.value = '');
    container.appendChild(newEntry);
});

// Add project entry
document.getElementById('add-project').addEventListener('click', () => {
    const container = document.getElementById('projects-container');
    const newEntry = container.children[0].cloneNode(true);
    newEntry.querySelectorAll('input, textarea').forEach(input => input.value = '');
    container.appendChild(newEntry);
});

// Initialize the scene
init();
