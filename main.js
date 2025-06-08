const container = document.getElementById('container');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const globeTexture = textureLoader.load('your-custom-image.jpg');

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshBasicMaterial({ map: globeTexture });
const globe = new THREE.Mesh(geometry, material);
scene.add(globe);

// Variables for custom drag rotation
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

renderer.domElement.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('mouseup', () => {
  isDragging = false;
});

renderer.domElement.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const deltaMove = {
    x: e.clientX - previousMousePosition.x,
    y: e.clientY - previousMousePosition.y,
  };

  const rotationSpeed = 0.005;

  globe.rotation.y += deltaMove.x * rotationSpeed;
  globe.rotation.x += deltaMove.y * rotationSpeed;

  previousMousePosition = { x: e.clientX, y: e.clientY };
});

// Zoom in/out with mouse wheel
renderer.domElement.addEventListener('wheel', (event) => {
  event.preventDefault();

  const zoomSpeed = 0.1;
  camera.position.z += event.deltaY * zoomSpeed * 0.01;

  // Clamp zoom distance between 1.5 and 10
  camera.position.z = Math.min(Math.max(camera.position.z, 1.5), 10);
}, { passive: false });

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
