// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#bg"), alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 1;

// Generate star particles
const starCount = 1000;
const geometry = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  positions.push(x, y, z);
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
const stars = new THREE.Points(geometry, material);
scene.add(stars);

// Mouse movement interaction
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  stars.rotation.x += 0.0005;
  stars.rotation.y += 0.0005;
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;
  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Reveal hero content on load
window.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  if (hero) hero.classList.add("show");
});