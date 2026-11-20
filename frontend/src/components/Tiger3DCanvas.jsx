import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Volume2 } from 'lucide-react';
import { playTigerRoar } from '../utils/audioSynthesizer';

gsap.registerPlugin(ScrollTrigger);

export default function Tiger3DCanvas() {
  const mountRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isRoaring, setIsRoaring] = useState(false);
  const tigerMeshRef = useRef(null);
  const shadowMeshRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // 2. Cinematic Sanctuary Lighting (Rich emerald key & amber rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.8);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const emeraldRimLight = new THREE.DirectionalLight(0x2E7D32, 2.2);
    emeraldRimLight.position.set(-6, 3, -2);
    scene.add(emeraldRimLight);

    const amberSunLight = new THREE.DirectionalLight(0xF28C1B, 2.5);
    amberSunLight.position.set(2, 5, -4);
    scene.add(amberSunLight);

    // 3. Load High-Resolution Photographic Real Tiger Textures
    const textureLoader = new THREE.TextureLoader();

    // Default Walking / Alert Real Bengal Tiger Cutout
    const realTigerTex = textureLoader.load(
      '/images/tiger_isolated.png',
      () => setModelLoaded(true)
    );
    realTigerTex.generateMipmaps = true;
    realTigerTex.minFilter = THREE.LinearMipmapLinearFilter;
    realTigerTex.magFilter = THREE.LinearFilter;
    realTigerTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Roaring Real Bengal Tiger Cutout
    const roaringTigerTex = textureLoader.load('/images/tiger_roaring_isolated.png');
    roaringTigerTex.generateMipmaps = true;
    roaringTigerTex.minFilter = THREE.LinearMipmapLinearFilter;
    roaringTigerTex.magFilter = THREE.LinearFilter;

    // 4. Create Real Tiger 3D Rig Group
    const tigerGroup = new THREE.Group();

    // Real Tiger Frontal Plane (Aspect Ratio: 1200 x 896 = 1.34)
    // Width 6.2, Height 4.63
    const tigerGeo = new THREE.PlaneGeometry(6.2, 4.63, 32, 32);
    const tigerMat = new THREE.MeshStandardMaterial({
      map: realTigerTex,
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.8,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const tigerMesh = new THREE.Mesh(tigerGeo, tigerMat);
    tigerMesh.position.set(0, 0.4, 0);
    tigerGroup.add(tigerMesh);
    tigerMeshRef.current = tigerMesh;

    // Subtle Fur Depth Layer (Gives volumetric presence in 3D space)
    const depthGeo = new THREE.PlaneGeometry(6.1, 4.55);
    const depthMat = new THREE.MeshBasicMaterial({
      map: realTigerTex,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const depthMesh = new THREE.Mesh(depthGeo, depthMat);
    depthMesh.position.set(0, 0.4, -0.05);
    tigerGroup.add(depthMesh);

    // 5. Realistic Ground Contact Shadow
    const createShadowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(256, 128, 10, 256, 128, 200);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(0.35, 'rgba(0, 20, 10, 0.6)');
      grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
      return new THREE.CanvasTexture(canvas);
    };

    const shadowGeo = new THREE.PlaneGeometry(5.8, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0.2, -1.8, 0);
    tigerGroup.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    tigerGroup.scale.set(1.15, 1.15, 1.15);
    scene.add(tigerGroup);

    // 6. ON PAGE LOAD ANIMATION: Real Tiger leaps into the hero and settles into an alert pose!
    tigerGroup.position.set(-5.5, 4.5, 1.2);
    tigerGroup.rotation.set(-0.25, -0.4, 0.25);
    shadowMesh.scale.set(0.3, 0.3, 0.3);
    shadowMesh.material.opacity = 0.1;

    gsap.to(tigerGroup.position, {
      x: 1.85,
      y: -0.35,
      z: 0.2,
      duration: 1.6,
      ease: 'power3.out',
      delay: 0.15,
    });

    gsap.to(tigerGroup.rotation, {
      x: 0,
      y: -0.25,
      z: 0,
      duration: 1.6,
      ease: 'power3.out',
      delay: 0.15,
    });

    gsap.to(shadowMesh.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.6,
      ease: 'power3.out',
      delay: 0.15,
    });

    gsap.to(shadowMesh.material, {
      opacity: 0.85,
      duration: 1.6,
      delay: 0.15,
    });

    // 7. GSAP SCROLLTRIGGER: Smooth Scroll-Driven Prowl Across Sections
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#tiger-scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      }
    });

    // Hero -> Live Stream (Prowls to the left to give space to live feed player)
    scrollTl.to(tigerGroup.position, {
      x: -2.3,
      y: -0.4,
      z: 0.3,
      ease: 'power1.inOut',
    }, 0.18);

    scrollTl.to(tigerGroup.rotation, {
      x: 0.05,
      y: 0.35,
      z: 0,
      ease: 'power1.inOut',
    }, 0.18);

    // Live Stream -> Zoo Map (Moves to upper right observation point)
    scrollTl.to(tigerGroup.position, {
      x: 2.1,
      y: -0.25,
      z: 0.1,
      ease: 'power1.inOut',
    }, 0.42);

    scrollTl.to(tigerGroup.rotation, {
      x: -0.05,
      y: -0.35,
      z: 0,
      ease: 'power1.inOut',
    }, 0.42);

    // Species Grid & Stories (Guardian stance on left)
    scrollTl.to(tigerGroup.position, {
      x: -2.1,
      y: -0.5,
      z: 0.2,
      ease: 'power1.inOut',
    }, 0.68);

    scrollTl.to(tigerGroup.rotation, {
      x: 0,
      y: 0.38,
      z: 0,
      ease: 'power1.inOut',
    }, 0.68);

    // Plan Your Visit & Conservation (Close-Up majestic frontal stance)
    scrollTl.to(tigerGroup.position, {
      x: 0,
      y: -0.3,
      z: 1.8,
      ease: 'power2.out',
    }, 0.92);

    scrollTl.to(tigerGroup.rotation, {
      x: 0.02,
      y: 0,
      z: 0,
      ease: 'power2.out',
    }, 0.92);

    scrollTl.to(tigerGroup.scale, {
      x: 1.35,
      y: 1.35,
      z: 1.35,
      ease: 'power2.out',
    }, 0.92);

    // 8. Mouse Tracking & Window Resize
    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. Interactive Roar Trigger Event Listener
    const handleTriggerRoar = () => {
      if (!tigerMeshRef.current) return;
      setIsRoaring(true);
      playTigerRoar();

      // Switch to Roaring texture
      tigerMeshRef.current.material.map = roaringTigerTex;
      tigerMeshRef.current.material.needsUpdate = true;

      // Roar recoil animation
      gsap.to(tigerMeshRef.current.scale, {
        x: 1.08,
        y: 1.08,
        duration: 0.2,
        yoyo: true,
        repeat: 3,
        ease: 'power1.inOut',
        onComplete: () => {
          setTimeout(() => {
            if (tigerMeshRef.current) {
              tigerMeshRef.current.material.map = realTigerTex;
              tigerMeshRef.current.material.needsUpdate = true;
              setIsRoaring(false);
            }
          }, 1200);
        }
      });
    };

    window.addEventListener('trigger-tiger-roar', handleTriggerRoar);

    // 10. Continuous 60 FPS Animation Loop (Breathing, Organic Mouse Tracking)
    let clock = new THREE.Clock();
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Organic breathing chest cycle
      const breath = Math.sin(elapsedTime * 2.2);
      if (tigerMeshRef.current) {
        tigerMeshRef.current.position.y = 0.4 + breath * 0.035;
        // Subtle perspective turn towards mouse
        tigerMeshRef.current.rotation.y = mouseRef.current.x * 0.22;
        tigerMeshRef.current.rotation.x = -mouseRef.current.y * 0.12;
      }

      // Shadow subtle breathing sync
      if (shadowMeshRef.current) {
        shadowMeshRef.current.scale.x = 1 + breath * 0.03;
        shadowMeshRef.current.scale.y = 1 + breath * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('trigger-tiger-roar', handleTriggerRoar);
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* Three.js Canvas Container (Fixed behind content) */}
      <div
        ref={mountRef}
        className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: modelLoaded ? 1 : 0 }}
      />

      {/* Floating Interactive "ROAR" Trigger Button */}
      <div className="fixed top-24 right-6 sm:right-12 z-30 pointer-events-auto">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent('trigger-tiger-roar'));
          }}
          className={`group px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 shadow-2xl transition-all border ${
            isRoaring
              ? 'bg-[#F28C1B] text-[#071D12] border-white scale-105'
              : 'bg-[#14532D]/85 hover:bg-[#2E7D32] text-white border-white/20 backdrop-blur-md'
          }`}
          title="Click to Hear Royal Bengal Tiger Roar"
        >
          <Volume2 className={`w-3.5 h-3.5 ${isRoaring ? 'animate-bounce text-[#071D12]' : 'text-[#F28C1B]'}`} />
          <span>{isRoaring ? '🐅 ROARING...' : '🐅 HEAR ROAR'}</span>
        </button>
      </div>
    </>
  );
}
