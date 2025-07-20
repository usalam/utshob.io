// Set up scene, camera, and renderer
const canvas = document.getElementById('bg'); // Use the existing canvas from index.html
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Generate star particles
const starCount = 4000;
const geometry = new THREE.BufferGeometry();
const positions = [];
const sizes = [];

for (let i = 0; i < starCount; i++) {
  const x = (Math.random() - 0.5) * 100;
  const y = (Math.random() - 0.5) * 100;
  const z = (Math.random() - 0.5) * 100; // Keep stars all around
  positions.push(x, y, z);
  sizes.push(Math.random() * 2 + .05); // Vary star size
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

// Define shader uniforms
const uniforms = {
  time: { value: 0.0 },
  pointTexture: { value: new THREE.TextureLoader().load('star2.png') }
};

// ShaderMaterial for twinkling effect
const material = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: `
    attribute float size;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / length(mvPosition.xyz)); // Scales with depth
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform sampler2D pointTexture;
    void main() {
      float alpha = .9 + 0.9 * sin(time + gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.1);
      vec4 texColor = texture2D(pointTexture, gl_PointCoord);
      if (texColor.a < 0.1) discard;
      gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending
});

// Add points to scene
const stars = new THREE.Points(geometry, material);
scene.add(stars);

// Mouse tracking for parallax effect
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

  uniforms.time.value = Date.now() * 0.002;

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Highlight active section in sidebar
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".sidebar a");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute("id");
      const link = document.querySelector(`.sidebar a[href="#${id}"]`);

      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove("active"));
        if (link) link.classList.add("active");
      }
    });
  },
  {
    rootMargin: "-30% 0px -60% 0px", // triggers when section is in the middle
    threshold: 0
  }
);

sections.forEach(section => {
  observer.observe(section);
});

// Fade in sections on scroll
const animatedSections = document.querySelectorAll('.section');

const fadeObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

animatedSections.forEach(section => fadeObserver.observe(section));


// Mobile menu toggle
const toggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});