import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Инициализация
const canvas = document.getElementById('canvas');
const loading = document.getElementById('loading');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

// Освещение
const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Создаем простую машину сразу (fallback)
function createSimpleCar() {
    const carGroup = new THREE.Group();
    
    // Кузов
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;
    body.castShadow = true;
    carGroup.add(body);
    
    // Крыша
    const roofGeometry = new THREE.BoxGeometry(1.5, 0.6, 2.5);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.1;
    roof.castShadow = true;
    carGroup.add(roof);
    
    // Колеса
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.set(-0.8, 0.3, 1.2);
    carGroup.add(wheel1);
    
    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.rotation.z = Math.PI / 2;
    wheel2.position.set(0.8, 0.3, 1.2);
    carGroup.add(wheel2);
    
    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel3.rotation.z = Math.PI / 2;
    wheel3.position.set(-0.8, 0.3, -1.2);
    carGroup.add(wheel3);
    
    const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel4.rotation.z = Math.PI / 2;
    wheel4.position.set(0.8, 0.3, -1.2);
    carGroup.add(wheel4);
    
    return carGroup;
}

// Создаем машину сразу
let car = createSimpleCar();
car.position.set(0, 0, 0);
car.castShadow = true;
scene.add(car);

// Скрываем загрузку
loading.style.display = 'none';

// Анимация вращения машины по скроллу
gsap.to(car.rotation, {
    y: Math.PI * 4,
    scrollTrigger: {
        trigger: '#container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: () => {
            renderer.render(scene, camera);
        }
    }
});

// Дополнительная анимация камеры
gsap.to(camera.position, {
    z: 8,
    scrollTrigger: {
        trigger: '#container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
    }
});

// Анимация появления плашек
const cards = document.querySelectorAll('.text-card');

cards.forEach((card, index) => {
    gsap.fromTo(card, 
        {
            opacity: 0,
            y: 100,
            scale: 0.8
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: card,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Анимационный цикл
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});