// Set up scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
camera.position.z = 5;

// Generate star particles
const starCount = 3000;
const geometry = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 200;
  const z = -Math.random() * 200;
  positions.push(x, y, z);
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 30,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.8,
  map: new THREE.TextureLoader().load('star.png'), // You’ll need to add this file
  alphaTest: 0.5
});
const stars = new THREE.Points(geometry, material);
scene.add(stars);

// Track mouse position
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// Animate scene
function animate() {
  requestAnimationFrame(animate);
  stars.rotation.x += 0.0005;
  stars.rotation.y += 0.0005;

  camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
  camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02;

  const time = Date.now() * 0.002;
  material.size = 0.7 + Math.sin(time) * 0.1;
  
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  stars.rotation.x = scrollY * 0.0002;
  stars.rotation.y = scrollY * 0.0002;

  // You can trigger class changes for hero
  const hero = document.querySelector('.hero');
  if (scrollY > 100) {
    hero.classList.add('show');
  } else {
    hero.classList.remove('show');
  }
});