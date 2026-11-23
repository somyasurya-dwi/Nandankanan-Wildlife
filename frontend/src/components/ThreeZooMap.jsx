import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { INITIAL_ANIMALS } from '../data/mockData';
import {
  Compass,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Orbit,
  Globe,
  Volume2,
  VolumeX,
  Crosshair,
  Sparkles,
  Layers,
  Eye,
  Tv,
  Radio,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

/**
 * Architectural 3D Floating Diorama Plinth Generator
 * Creates an elegant, solid beveled bedrock base with clean architectural proportions
 * that lifts and showcases the sanctuary diorama floating gracefully in space.
 */
function createFloatingIslandBase(width, depth) {
  const geom = new THREE.BufferGeometry();
  const segments = 48;
  const layers = [
    { y: 0.1, sx: 1.01, sz: 1.01, noiseAmp: 0.1 },
    { y: -1.2, sx: 1.00, sz: 1.00, noiseAmp: 0.18 },
    { y: -2.6, sx: 0.98, sz: 0.98, noiseAmp: 0.25 },
    { y: -3.8, sx: 0.94, sz: 0.94, noiseAmp: 0.18 },
    { y: -4.5, sx: 0.88, sz: 0.88, noiseAmp: 0.1 }
  ];

  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let l = 0; l < layers.length; l++) {
    const layer = layers[l];
    for (let s = 0; s < segments; s++) {
      const angle = (s / segments) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const halfW = (width * 0.5) * layer.sx;
      const halfD = (depth * 0.5) * layer.sz;
      const noise = (Math.sin(s * 3.7 + l * 2.1) * 0.5 + Math.cos(s * 5.2 - l * 1.5) * 0.5) * layer.noiseAmp;
      const x = cosA * halfW + (cosA > 0 ? 1 : -1) * noise * 0.4;
      const z = sinA * halfD + (sinA > 0 ? 1 : -1) * noise * 0.4;
      const y = layer.y + (Math.sin(s * 2.3) * 0.15) * (l > 0 ? 1 : 0);
      vertices.push(x, y, z);
      uvs.push(s / segments, l / (layers.length - 1));
    }
  }

  // Apex tip at bottom center
  const apexIndex = layers.length * segments;
  vertices.push(0, -5.0, 0);
  uvs.push(0.5, 1.0);

  // Side quads between elliptical layers
  for (let l = 0; l < layers.length - 1; l++) {
    const ringStart = l * segments;
    const nextRingStart = (l + 1) * segments;
    for (let s = 0; s < segments; s++) {
      const nextS = (s + 1) % segments;
      const a = ringStart + s;
      const b = nextRingStart + s;
      const c = nextRingStart + nextS;
      const d = ringStart + nextS;
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // Bottom cone triangles connecting to apex
  const lastRingStart = (layers.length - 1) * segments;
  for (let s = 0; s < segments; s++) {
    const nextS = (s + 1) % segments;
    indices.push(lastRingStart + s, apexIndex, lastRingStart + nextS);
  }

  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  return geom;
}

/**
 * ThreeZooMap - Google Earth-Class 3D Floating Diorama for Nandankanan Sanctuary
 * Features:
 * - Luxury Architectural 3D Diorama model floating in space
 * - Solid beveled rock cliff walls & glowing emerald contour trim
 * - Full 360° circular orbit rotation (mouse, touch & brisk auto-orbit)
 * - Optimal isometric ~42° elevated perspective showcasing both the rich 3D surface and floating diorama sides
 * - 3D Terrain elevation relief (Sal woodland ridges, Lake Kanjia basin, 3D trees)
 * - Clean visual presentation (zero particle clutter)
 * - Synchronized species identification HUD and compass
 */
export default function ThreeZooMap({
  markers = [],
  activeMarker = null,
  onSelectMarker = () => {},
  selectedCategory = 'all',
  onOpenLiveCam = null,
  isolateMarkerId = null,
  focusTrigger = 0,
  onResetIsolate = null,
  isFullscreen = false,
  isExpanded = false
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);
  const islandGroupRef = useRef(null);
  const shadowMeshRef = useRef(null);
  const beaconGroupRef = useRef(null);
  const treeGroupRef = useRef(null);
  const terrainMeshRef = useRef(null);
  const waterMeshRef = useRef(null);

  // Screen-projected 2D pin positions for HTML badges
  const [pinPositions, setPinPositions] = useState([]);
  const [cameraHeading, setCameraHeading] = useState(0); // Heading in degrees (0 = North)
  const [cameraPitch, setCameraPitch] = useState(55); // Pitch angle in degrees
  const [is3DMode, setIs3DMode] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const isAutoRotateRef = useRef(true);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotate;
      controlsRef.current.autoRotateSpeed = 2.5;
    }
  }, [isAutoRotate]);

  const isolateMarkerIdRef = useRef(isolateMarkerId);
  useEffect(() => {
    isolateMarkerIdRef.current = isolateMarkerId;
  }, [isolateMarkerId]);

  const selectedCategoryRef = useRef(selectedCategory);
  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  // Map coordinate conversion constants (Plane is 100 x 51.37 in 3D units)
  const MAP_W = 100;
  const MAP_D = 51.37;

  // Calculates 3D terrain elevation for any (x, z)
  const getTerrainElevation = useCallback((x, z) => {
    // Lake Kanjia basin (Depressed freshwater lake bed on North-East)
    if (x > 10 && z < -4) {
      const lakeDist = Math.hypot(x - 28, z - (-14));
      if (lakeDist < 18) {
        return -0.85;
      }
    }
    // Sloth Bear & Lion Safari rocky escarpment (Elevated ridge on West)
    if (x < -14 && z > -12 && z < 18) {
      return 2.4 + Math.sin(x * 0.2) * 0.8;
    }
    // Tiger Safari woodland ridge (Central-West)
    if (x > -22 && x < 5 && z > 5 && z < 22) {
      return 1.4 + Math.cos(z * 0.15) * 0.6;
    }
    // General gentle rolling sanctuary topography
    return Math.sin(x * 0.08) * 0.5 + Math.cos(z * 0.08) * 0.4;
  }, []);

  // Convert Leaflet map_x (0-1024) and map_y (0-526) to 3D world (X, Y, Z)
  const get3DCoords = useCallback((marker) => {
    if (!marker) return { x: 0, y: 0, z: 0 };
    const normX = (marker.map_x !== undefined ? marker.map_x : 512) / 1024;
    const normY = (marker.map_y !== undefined ? marker.map_y : 263) / 526;
    const x = (normX - 0.5) * MAP_W;
    const z = (0.5 - normY) * MAP_D;
    const y = getTerrainElevation(x, z);
    return { x, y, z };
  }, [getTerrainElevation]);

  // Cinematic 3D "Fly-To" camera swoop to selected animal enclosure
  const flyToAnimal = useCallback((marker, tightZoom = false) => {
    if (!marker || !controlsRef.current || !cameraRef.current) return;
    const { x, y, z } = get3DCoords(marker);
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    const isTight = tightZoom || Boolean(isolateMarkerId) || Boolean(marker._isolate);
    const dist = isTight ? 18 : 28;

    let currentHeadingRad = 0;
    const dx = camera.position.x - controls.target.x;
    const dz = camera.position.z - controls.target.z;
    if (Math.hypot(dx, dz) > 0.1) {
      currentHeadingRad = Math.atan2(dx, dz);
    }

    const targetCamX = x + Math.sin(currentHeadingRad) * (dist * 0.72);
    const targetCamY = y + (isTight ? 12 : 18);
    const targetCamZ = z + Math.cos(currentHeadingRad) * (dist * 0.72);

    controls.minDistance = 4;
    controls.enabled = false;

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);

    const animState = {
      camX: camera.position.x,
      camY: camera.position.y,
      camZ: camera.position.z,
      tarX: controls.target.x,
      tarY: controls.target.y,
      tarZ: controls.target.z
    };

    gsap.to(animState, {
      camX: targetCamX,
      camY: targetCamY,
      camZ: targetCamZ,
      tarX: x,
      tarY: y + 0.5,
      tarZ: z,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.set(animState.camX, animState.camY, animState.camZ);
        controls.target.set(animState.tarX, animState.tarY, animState.tarZ);
        camera.lookAt(controls.target);
      },
      onComplete: () => {
        camera.position.set(targetCamX, targetCamY, targetCamZ);
        controls.target.set(x, y + 0.5, z);
        controls.enabled = true;
        controls.update();
      }
    });
  }, [get3DCoords, isolateMarkerId]);

  // Start continuous 360° turntable circular orbit rotation (matching user reference video)
  const startOrbitRotation = useCallback(() => {
    setIsAutoRotate(true);
    isAutoRotateRef.current = true;
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 2.5;
    }
  }, []);

  // Toggle 360° circular auto-orbit on/off
  const toggleAutoRotate = useCallback(() => {
    setIsAutoRotate((prev) => {
      const next = !prev;
      isAutoRotateRef.current = next;
      if (controlsRef.current) {
        controlsRef.current.autoRotate = next;
        controlsRef.current.autoRotateSpeed = 2.5;
      }
      return next;
    });
  }, []);

  // Reset camera to golden presentation pose (Upright, front-facing, centered & level)
  const resetToFrontView = useCallback((smooth = true) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    if (!smooth) {
      camera.position.set(0, 48, 54);
      controls.target.set(0, 0, 0);
      controls.update();
      startOrbitRotation();
      return;
    }

    controls.enabled = false;
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);

    const animState = {
      camX: camera.position.x,
      camY: camera.position.y,
      camZ: camera.position.z,
      tarX: controls.target.x,
      tarY: controls.target.y,
      tarZ: controls.target.z
    };

    gsap.to(animState, {
      camX: 0,
      camY: 48,
      camZ: 54,
      tarX: 0,
      tarY: 0,
      tarZ: 0,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        camera.position.set(animState.camX, animState.camY, animState.camZ);
        controls.target.set(animState.tarX, animState.tarY, animState.tarZ);
        camera.lookAt(controls.target);
      },
      onComplete: () => {
        camera.position.set(0, 48, 54);
        controls.target.set(0, 0, 0);
        controls.minDistance = 16;
        controls.enabled = true;
        controls.update();
        startOrbitRotation();
      }
    });
  }, [startOrbitRotation]);

  // Center / Zoom Out to view the entire floating sanctuary diorama
  const handleOverview = useCallback(() => {
    if (onResetIsolate) onResetIsolate();
    resetToFrontView(true);
    startOrbitRotation();
  }, [onResetIsolate, resetToFrontView, startOrbitRotation]);

  // Toggle between 3D oblique perspective and 2D overhead top-down view
  const toggle2D3D = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const tx = controls.target.x;
    const ty = controls.target.y;
    const tz = controls.target.z;

    const currentDist = camera.position.distanceTo(controls.target);
    const clampedDist = Math.max(30, Math.min(currentDist, 72));

    if (is3DMode) {
      // Transition to top-down 2D
      gsap.to(camera.position, {
        x: tx,
        y: ty + clampedDist,
        z: tz + 0.1,
        duration: 0.7,
        ease: 'power2.inOut',
        onUpdate: () => controls.update()
      });
      setIs3DMode(false);
    } else {
      // Transition back to dramatic 3D Google Earth angle
      gsap.to(camera.position, {
        x: tx,
        y: ty + clampedDist * 0.65,
        z: tz + clampedDist * 0.75,
        duration: 0.7,
        ease: 'power2.inOut',
        onUpdate: () => controls.update()
      });
      setIs3DMode(true);
    }
  }, [is3DMode]);

  // Reset North heading (pointing compass straight up)
  const resetNorth = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    const dx = camera.position.x - controls.target.x;
    const dz = camera.position.z - controls.target.z;
    const r = Math.hypot(dx, dz);
    const currentY = camera.position.y;

    gsap.to(camera.position, {
      x: controls.target.x,
      y: currentY,
      z: controls.target.z + r,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => controls.update(),
      onComplete: () => {
        startOrbitRotation();
      }
    });
  }, [startOrbitRotation]);

  // Tilt Up (closer to horizon)
  const handleTiltUp = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const tx = controls.target.x;
    const ty = controls.target.y;
    const tz = controls.target.z;

    const dx = camera.position.x - tx;
    const dy = camera.position.y - ty;
    const dz = camera.position.z - tz;
    const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const phi = Math.acos(dy / r);

    const targetPhi = Math.min(phi + 0.18, Math.PI * 0.44);
    const theta = Math.atan2(dx, dz);

    gsap.to(camera.position, {
      x: tx + r * Math.sin(targetPhi) * Math.sin(theta),
      y: ty + r * Math.cos(targetPhi),
      z: tz + r * Math.sin(targetPhi) * Math.cos(theta),
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => controls.update()
    });
  }, []);

  // Tilt Down (closer to overhead)
  const handleTiltDown = useCallback(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const tx = controls.target.x;
    const ty = controls.target.y;
    const tz = controls.target.z;

    const dx = camera.position.x - tx;
    const dy = camera.position.y - ty;
    const dz = camera.position.z - tz;
    const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const phi = Math.acos(dy / r);

    const targetPhi = Math.max(phi - 0.18, 0.16);
    const theta = Math.atan2(dx, dz);

    gsap.to(camera.position, {
      x: tx + r * Math.sin(targetPhi) * Math.sin(theta),
      y: ty + r * Math.cos(targetPhi),
      z: tz + r * Math.sin(targetPhi) * Math.cos(theta),
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => controls.update()
    });
  }, []);

  // Rotate Heading in Circle Direction (Left / Right by 45 degrees) - Snappy
  const handleRotate = useCallback((direction = 1) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const tx = controls.target.x;
    const ty = controls.target.y;
    const tz = controls.target.z;

    const dx = camera.position.x - tx;
    const dz = camera.position.z - tz;
    const r = Math.hypot(dx, dz);
    const currentAngle = Math.atan2(dx, dz);
    const targetAngle = currentAngle + (direction * Math.PI / 4);

    gsap.to(camera.position, {
      x: tx + Math.sin(targetAngle) * r,
      z: tz + Math.cos(targetAngle) * r,
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => controls.update()
    });
  }, []);

  // Fast 360-Degree Continuous Cinematic Sweep in Circle (2.0s)
  const handle360Spin = useCallback((direction = 1) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const tx = controls.target.x;
    const ty = controls.target.y;
    const tz = controls.target.z;

    const dx = camera.position.x - tx;
    const dz = camera.position.z - tz;
    const r = Math.hypot(dx, dz);
    const currentAngle = Math.atan2(dx, dz);
    const targetAngle = currentAngle + (direction * Math.PI * 2);

    controls.enabled = false;
    const anim = { angle: currentAngle };
    gsap.to(anim, {
      angle: targetAngle,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.position.x = tx + Math.sin(anim.angle) * r;
        camera.position.z = tz + Math.cos(anim.angle) * r;
        controls.update();
      },
      onComplete: () => {
        controls.enabled = true;
        controls.update();
      }
    });
  }, []);

  // Zoom In / Zoom Out
  const handleZoom = useCallback((factor = 0.8) => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const tx = controls.target.x;
    const ty = controls.target.y;
    const tz = controls.target.z;

    const targetCamX = tx + (camera.position.x - tx) * factor;
    const targetCamY = ty + (camera.position.y - ty) * factor;
    const targetCamZ = tz + (camera.position.z - tz) * factor;

    gsap.to(camera.position, {
      x: targetCamX,
      y: targetCamY,
      z: targetCamZ,
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => controls.update()
    });
  }, []);

  // Update animated 3D Light Pillar whenever activeMarker or focusTrigger changes
  useEffect(() => {
    if (!beaconGroupRef.current || !activeMarker) return;
    const beacon = beaconGroupRef.current;
    const { x, y, z } = get3DCoords(activeMarker);

    beacon.position.set(x, y, z);
    beacon.visible = true;

    const isTight = Boolean(isolateMarkerId) || Boolean(activeMarker._isolate);
    flyToAnimal(activeMarker, isTight);
  }, [activeMarker, focusTrigger, isolateMarkerId, get3DCoords, flyToAnimal]);

  // Main Three.js Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let curW = Math.max(container.clientWidth || rect.width || 800, 320);
    let curH = Math.max(container.clientHeight || rect.height || 580, 400);

    // 1. Scene & Distant Horizon Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#071d14');
    scene.fog = new THREE.Fog(0x071d14, 250, 600);
    sceneRef.current = scene;

    // 2. Camera Setup: Golden Isometric Perspective (Frames whole floating diorama like image 1, showing rich 3D surface like image 2)
    const camera = new THREE.PerspectiveCamera(46, curW / curH, 0.5, 700);
    camera.position.set(0, 48, 54);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(curW, curH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls with 360° Circular Orbit
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 1.35;
    controls.screenSpacePanning = false;
    controls.minDistance = 16;
    controls.maxDistance = 140;
    controls.maxPolarAngle = Math.PI * 0.38; // Keeps camera ~22° above horizon, always displaying lush surface and never showing underside
    controls.minPolarAngle = 0.18;
    controls.target.set(0, 0, 0);

    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;

    controls.autoRotate = isAutoRotateRef.current;
    controls.autoRotateSpeed = 2.5; // Smooth continuous 360° turntable orbit (matches video: ~24s per revolution)

    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;

    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    controlsRef.current = controls;

    let idleTimer = null;
    const handleCanvasInteractionStart = () => {
      if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }
      if (idleTimer) clearTimeout(idleTimer);
    };

    const handleCanvasInteractionEnd = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (controlsRef.current && isAutoRotateRef.current) {
          controlsRef.current.autoRotate = true;
          controlsRef.current.autoRotateSpeed = 2.5;
        }
      }, 1500);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handleCanvasInteractionStart);
    domEl.addEventListener('pointerup', handleCanvasInteractionEnd);
    domEl.addEventListener('pointerleave', handleCanvasInteractionEnd);

    const onCanvasWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 0.88 : 1.14;
      handleZoom(factor);
    };
    domEl.addEventListener('wheel', onCanvasWheel, { passive: false });

    const onCanvasDblClick = () => {
      handleZoom(0.72);
    };
    domEl.addEventListener('dblclick', onCanvasDblClick);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    sunLight.position.set(40, 80, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x7dd3fc, 0.9);
    rimLight.position.set(-45, 30, -35);
    scene.add(rimLight);

    // 6. Floating Sanctuary Continent Group (All meshes levitate together)
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);
    islandGroupRef.current = islandGroup;

    // 7. 3D Terrain Geometry with Elevation Relief
    const terrainGeo = new THREE.PlaneGeometry(MAP_W, MAP_D, 120, 75);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const vy = getTerrainElevation(vx, vz);
      posAttr.setY(i, vy);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.18,
      metalness: 0.0,
      flatShading: false
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    terrainMesh.castShadow = false;
    islandGroup.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // Load High-Definition 4K Nandankanan Zoo Map Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/images/nandankanan_zoo_map_4k.jpg',
      (mapTexture) => {
        mapTexture.colorSpace = THREE.SRGBColorSpace;
        const maxAniso = renderer.capabilities.getMaxAnisotropy();
        mapTexture.anisotropy = maxAniso;
        mapTexture.generateMipmaps = true;
        mapTexture.minFilter = THREE.LinearMipmapLinearFilter;
        mapTexture.magFilter = THREE.LinearFilter;
        terrainMat.map = mapTexture;
        terrainMat.roughness = 0.18;
        terrainMat.metalness = 0.0;
        terrainMat.color.setHex(0xffffff);
        terrainMat.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('Map texture load note, fallback green terrain active:', err);
      }
    );

    // 8. Organic Floating Bedrock Island Hull (Tapered rock cone down to y = -15.5)
    const floatingBaseGeo = createFloatingIslandBase(MAP_W, MAP_D);
    const floatingBaseMat = new THREE.MeshStandardMaterial({
      color: 0x143222,
      roughness: 0.85,
      metalness: 0.08,
      flatShading: true
    });
    const floatingBaseMesh = new THREE.Mesh(floatingBaseGeo, floatingBaseMat);
    floatingBaseMesh.castShadow = true;
    floatingBaseMesh.receiveShadow = true;
    islandGroup.add(floatingBaseMesh);

    // 9. Soft Floating Ground Shadow Plane (Grounded right under base at y = -16.0)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 512;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    const shadowGrad = shadowCtx.createRadialGradient(256, 128, 10, 256, 128, 240);
    shadowGrad.addColorStop(0, 'rgba(0, 15, 8, 0.75)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 15, 8, 0.45)');
    shadowGrad.addColorStop(0.85, 'rgba(0, 15, 8, 0.12)');
    shadowGrad.addColorStop(1, 'rgba(0, 15, 8, 0)');
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 512, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(MAP_W * 1.35, MAP_D * 1.35);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -5.2;
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // 12. Lake Kanjia Shimmering 3D Water Surface
    const waterGeo = new THREE.PlaneGeometry(36, 20, 24, 24);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.06,
      metalness: 0.82,
      transparent: true,
      opacity: 0.75
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(28, -0.42, -14);
    islandGroup.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 13. 3D Miniature Sal & Teak Forest Trees
    const treeGroup = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.3, 6);
    const foliageGeo1 = new THREE.ConeGeometry(0.85, 1.7, 6);
    const foliageGeo2 = new THREE.ConeGeometry(0.68, 1.4, 6);

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.9 });
    const foliageMatA = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.7 });
    const foliageMatB = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.7 });
    const foliageMatC = new THREE.MeshStandardMaterial({ color: 0x40916c, roughness: 0.7 });
    const foliageMats = [foliageMatA, foliageMatB, foliageMatC];

    const treeCount = 95;
    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2;
      const rx = (Math.cos(angle) * 0.44 + (Math.sin(i * 3.7) * 0.06)) * MAP_W;
      const rz = (Math.sin(angle) * 0.44 + (Math.cos(i * 4.3) * 0.06)) * MAP_D;

      if (rx > 14 && rz < -6) continue;

      const ry = getTerrainElevation(rx, rz);

      const tree = new THREE.Group();
      tree.position.set(rx, ry, rz);

      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.65;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageMat = foliageMats[i % foliageMats.length];
      const cone1 = new THREE.Mesh(foliageGeo1, foliageMat);
      cone1.position.y = 1.6;
      cone1.castShadow = true;
      tree.add(cone1);

      const cone2 = new THREE.Mesh(foliageGeo2, foliageMat);
      cone2.position.y = 2.4;
      cone2.castShadow = true;
      tree.add(cone2);

      const scale = 0.75 + (Math.sin(i * 1.5) + 1) * 0.25;
      tree.scale.set(scale, scale, scale);

      treeGroup.add(tree);
    }
    islandGroup.add(treeGroup);
    treeGroupRef.current = treeGroup;

    // 14. 3D Target Identification Beacon
    const beaconGroup = new THREE.Group();

    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.65, 36, 16, 1, true);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 18;
    beaconGroup.add(pillar);

    const coreGeo = new THREE.CylinderGeometry(0.02, 0.05, 36, 8);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coreBeam = new THREE.Mesh(coreGeo, coreMat);
    coreBeam.position.y = 18;
    beaconGroup.add(coreBeam);

    const ringGeo1 = new THREE.RingGeometry(1.2, 1.45, 32);
    ringGeo1.rotateX(-Math.PI / 2);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.position.y = 0.05;
    beaconGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(2.0, 2.25, 32);
    ringGeo2.rotateX(-Math.PI / 2);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.position.y = 0.08;
    beaconGroup.add(ring2);

    islandGroup.add(beaconGroup);
    beaconGroupRef.current = beaconGroup;

    if (activeMarker) {
      const { x, y, z } = get3DCoords(activeMarker);
      beaconGroup.position.set(x, y, z);
      beaconGroup.visible = true;
      if (isolateMarkerId || activeMarker._isolate) {
        setTimeout(() => {
          flyToAnimal(activeMarker, true);
        }, 120);
      }
    } else {
      beaconGroup.visible = false;
    }

    // 15. Animation Loop & Screen Projection for HTML Badges
    let clock = new THREE.Clock();
    let lastUiUpdate = 0;

    const updateProjection = (now) => {
      if (now - lastUiUpdate < 40) return;
      lastUiUpdate = now;

      const camPos = camera.position;
      const targetPos = controls.target;
      const dx = camPos.x - targetPos.x;
      const dy = camPos.y - targetPos.y;
      const dz = camPos.z - targetPos.z;

      // Heading (azimuth): angle around Y axis
      const headingRad = Math.atan2(dx, dz);
      const headingDeg = (headingRad * 180 / Math.PI + 360) % 360;
      setCameraHeading(headingDeg);

      // Pitch: angle from horizon
      const groundDist = Math.hypot(dx, dz);
      const pitchDeg = Math.atan2(dy, groundDist) * 180 / Math.PI;
      setCameraPitch(pitchDeg);

      const w = curW;
      const h = curH;

      const projected = markers
        .filter((m) => {
          if (isolateMarkerIdRef.current) return m.id === isolateMarkerIdRef.current;
          return selectedCategoryRef.current === 'all' || m.category === selectedCategoryRef.current;
        })
        .map((marker) => {
          const { x, y, z } = get3DCoords(marker);
          const worldPos = new THREE.Vector3(x, y + 2.2, z);

          // Apply islandGroup world matrix so HTML pins follow floating levitation and rotation!
          if (islandGroupRef.current) {
            worldPos.applyMatrix4(islandGroupRef.current.matrixWorld);
          }

          worldPos.project(camera);

          const isVisible = worldPos.z < 1;
          const screenX = (worldPos.x * 0.5 + 0.5) * w;
          const screenY = (-worldPos.y * 0.5 + 0.5) * h;

          return {
            id: marker.id,
            marker,
            screenX,
            screenY,
            isVisible,
            zIndex: Math.round((1 - worldPos.z) * 1000)
          };
        });

      setPinPositions(projected);
    };

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Graceful, attractive floating levitation motion
      // Smooth sinusoidal elevation wave that makes the 3D diorama hover majestically in space
      const floatY = Math.sin(elapsedTime * 1.1) * 0.65;

      islandGroup.position.y = floatY;
      islandGroup.rotation.x = 0; // Keep level so terrain is upright, crisp & readable!
      islandGroup.rotation.z = 0;
      islandGroup.updateMatrixWorld();

      // Dynamic breathing ground shadow scaling with height
      if (shadowMeshRef.current) {
        const shadowScale = 1.0 + floatY * 0.035;
        shadowMeshRef.current.scale.set(shadowScale, 1, shadowScale);
        shadowMeshRef.current.material.opacity = Math.max(0.3, 0.58 - floatY * 0.06);
      }

      controls.update();

      // Animate Light Beacon
      if (beaconGroup.visible) {
        pillar.rotation.y = elapsedTime * 1.2;
        ring1.rotation.y = -elapsedTime * 1.6;
        ring2.rotation.y = elapsedTime * 1.3;
        const pulse = 0.22 + Math.sin(elapsedTime * 4.0) * 0.1;
        pillarMat.opacity = pulse;
        ringMat1.opacity = 0.45 + Math.sin(elapsedTime * 4.0) * 0.18;
      }

      // Animate Lake Kanjia water sheen
      if (waterMesh) {
        waterMat.opacity = 0.74 + Math.sin(elapsedTime * 2.0) * 0.07;
      }

      updateProjection(performance.now());

      renderer.render(scene, camera);
    };

    animate();

    // Listen for custom navigation event from navbar or hero buttons to start continuous orbit
    const handleStartOrbit = () => {
      const dx = camera.position.x - controls.target.x;
      const dy = camera.position.y - controls.target.y;
      const dz = camera.position.z - controls.target.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const isOffCenter = controls.target.length() > 2.0;
      const isZoomed = dist < 50 || dist > 85;

      if (isOffCenter || isZoomed) {
        resetToFrontView(true);
      } else {
        startOrbitRotation();
      }
    };
    window.addEventListener('start-zoo-map-orbit', handleStartOrbit);
    window.addEventListener('reset-zoo-map-view', handleStartOrbit);

    // Automatically start 360° turntable orbit whenever visitor scrolls or moves to the map section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleStartOrbit();
          }
        });
      },
      { threshold: 0.15 }
    );
    if (container) observer.observe(container);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 100 && newH > 100) {
          curW = newW;
          curH = newH;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener('start-zoo-map-orbit', handleStartOrbit);
      window.removeEventListener('reset-zoo-map-view', handleStartOrbit);
      if (observer && container) observer.unobserve(container);
      resizeObserver.disconnect();
      if (idleTimer) clearTimeout(idleTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('wheel', onCanvasWheel);
        renderer.domElement.removeEventListener('dblclick', onCanvasDblClick);
        renderer.domElement.removeEventListener('pointerdown', handleCanvasInteractionStart);
        renderer.domElement.removeEventListener('pointerup', handleCanvasInteractionEnd);
        renderer.domElement.removeEventListener('pointerleave', handleCanvasInteractionEnd);
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      terrainGeo.dispose();
      if (typeof floatingBaseGeo !== 'undefined' && floatingBaseGeo) floatingBaseGeo.dispose();
      shadowGeo.dispose();
      waterGeo.dispose();
      scene.clear();
    };
  }, [getTerrainElevation, get3DCoords, markers, selectedCategory, handleZoom]);

  const animalBio = activeMarker
    ? INITIAL_ANIMALS.find(
        (a) =>
          a.slug === activeMarker.animal_slug ||
          a.name.toLowerCase() === (activeMarker.animal_name || activeMarker.title).toLowerCase()
      )
    : null;

  return (
    <div className={`relative w-full ${isFullscreen ? 'h-full flex-1 min-h-screen' : isExpanded ? 'h-[620px] sm:h-[700px] md:h-[780px] lg:h-[840px] xl:h-[900px]' : 'h-[420px] sm:h-[480px] md:h-[540px] lg:h-[580px] xl:h-[600px] 2xl:h-[620px]'} bg-forest-950 overflow-hidden select-none transition-all duration-300`}>

      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        onClick={() => {
          if (activeMarker || isolateMarkerId) {
            handleOverview();
          } else if (!isAutoRotateRef.current) {
            startOrbitRotation();
          }
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* TOP SCI-FI / GOOGLE EARTH SPECIES IDENTIFICATION HUD BANNER */}
      {activeMarker && (
        <div className="absolute top-4 left-4 max-w-[calc(100%-110px)] sm:max-w-[calc(100%-130px)] z-20 pointer-events-none flex flex-col gap-1.5 animate-fadeIn">
          <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-forest-950/92 backdrop-blur-xl border border-gold-500/40 shadow-2xl pointer-events-auto self-start max-w-full">
            {/* Pulsing Target Lock Scanner Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold tracking-widest shrink-0 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>TARGET LOCKED: SPECIES IDENTIFIED</span>
            </div>

            {/* Animal Common & Scientific Name */}
            <div 
              onClick={() => onOpenLiveCam && onOpenLiveCam(activeMarker)}
              className="flex items-baseline gap-2 truncate cursor-pointer hover:text-gold-300 transition-colors pointer-events-auto"
              title="Click to view live stream"
            >
              <span className="text-sm sm:text-base font-display font-black text-ivory-50 tracking-wide truncate">
                {activeMarker.animal_name || activeMarker.title}
              </span>
              {(animalBio?.scientific_name || activeMarker.scientific_name) && (
                <span className="text-xs text-gold-300/80 italic font-serif hidden md:inline truncate">
                  ({animalBio?.scientific_name || activeMarker.scientific_name})
                </span>
              )}
            </div>

            {/* Conservation Status Badge */}
            {(animalBio?.conservation_status || activeMarker.badge_text) && (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30 shrink-0 hidden sm:inline">
                {animalBio?.conservation_status || activeMarker.badge_text}
              </span>
            )}

            {/* Live Camera Shortcut */}
            {onOpenLiveCam && (
              <button
                onClick={() => onOpenLiveCam(activeMarker)}
                className="ml-auto px-2.5 py-1 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md transition-all shrink-0 pointer-events-auto cursor-pointer"
                title="Launch Live Observation Modal"
              >
                <Tv className="w-3 h-3 animate-pulse" />
                <span className="hidden sm:inline">Live Cam</span>
              </button>
            )}
          </div>

          {/* Sub-bar Telemetry */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-ivory-300/80 px-2 pointer-events-none drop-shadow">
            <span className="flex items-center gap-1 text-gold-400">
              <Crosshair className="w-3 h-3" />
              <span>GEO: {activeMarker.latitude?.toFixed(4)}°N, {activeMarker.longitude?.toFixed(4)}°E</span>
            </span>
            <span className="text-ivory-400/50 hidden sm:inline">•</span>
            <span className="text-emerald-400 hidden sm:inline">4K ARCHITECTURAL DIORAMA: ACTIVE</span>
            <span className="text-ivory-400/50 hidden sm:inline">•</span>
            <span className="hidden sm:inline">360° Circular Orbit • Drag in Circle to Rotate</span>
          </div>

          {/* ISOLATED REGION ONLY BADGE + SHOW ALL ANIMALS TOGGLE */}
          {isolateMarkerId && (
            <div className="flex items-center gap-2 mt-1 self-start pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/60 shadow-xl backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider">
                  Showing {activeMarker?.animal_name || 'Animal'} Region Only
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onResetIsolate) onResetIsolate();
                    handleOverview();
                  }}
                  className="ml-1 px-2.5 py-0.5 rounded-full bg-gold-500 hover:bg-gold-400 text-forest-950 font-black text-[9px] uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Show Full Park
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCREEN-PROJECTED 3D FLOATING ANIMAL PINS */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {pinPositions.map((pin) => {
          if (!pin.isVisible) return null;
          const isSelected = activeMarker && activeMarker.id === pin.id;
          const animalPhoto = pin.marker.photo_url || '/images/royal_bengal_tiger.jpg';
          const animalName = pin.marker.animal_name || pin.marker.title;
          const animalEmoji = pin.marker.emoji || '🐾';

          let pinBorder = '#C8A96B';
          let pinGlow = 'rgba(200, 169, 107, 0.6)';
          if (pin.marker.category === 'safari_zone') {
            pinBorder = '#F59E0B';
            pinGlow = 'rgba(245, 158, 11, 0.7)';
          } else if (pin.marker.category === 'water_body') {
            pinBorder = '#38BDF8';
            pinGlow = 'rgba(56, 189, 248, 0.65)';
          } else if (pin.marker.category === 'visitor_facility') {
            pinBorder = '#10B981';
            pinGlow = 'rgba(16, 185, 129, 0.6)';
          }

          return (
            <div
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectMarker(pin.marker);
              }}
              style={{
                left: `${pin.screenX}px`,
                top: `${pin.screenY}px`,
                zIndex: isSelected ? 999 : pin.zIndex,
                transform: `translate(-50%, -100%) scale(${isSelected ? 1.15 : 1})`,
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              className="absolute pointer-events-auto cursor-pointer group flex flex-col items-center"
            >
              {/* Radar pulse beacon when selected */}
              {isSelected && (
                <div
                  className="absolute -top-1 w-12 h-12 rounded-full pointer-events-none animate-ping"
                  style={{
                    backgroundColor: pinGlow,
                    filter: 'blur(4px)'
                  }}
                />
              )}

              {/* Glowing Jewel Avatar */}
              <div
                style={{
                  borderColor: pinBorder,
                  boxShadow: isSelected
                    ? `0 0 20px ${pinGlow}, 0 6px 16px rgba(0,0,0,0.9)`
                    : `0 0 10px ${pinGlow}, 0 4px 12px rgba(0,0,0,0.8)`
                }}
                className={`relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 overflow-hidden bg-forest-950 transition-all duration-300 group-hover:scale-115 ${
                  isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-forest-950' : ''
                }`}
              >
                <img
                  src={animalPhoto}
                  alt={animalName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Glass Capsule Label */}
              <div
                style={{
                  borderColor: pinBorder,
                  backgroundColor: isSelected ? 'rgba(11, 36, 25, 0.98)' : 'rgba(11, 36, 25, 0.92)'
                }}
                className={`relative z-20 -mt-1 px-2.5 py-0.5 rounded-full border backdrop-blur-md text-[10px] sm:text-[10.5px] font-bold text-ivory-100 whitespace-nowrap shadow-xl flex items-center gap-1 transition-all duration-200 group-hover:scale-105 ${
                  isSelected ? 'text-gold-300 font-extrabold border-gold-400' : ''
                }`}
              >
                <span>{animalEmoji}</span>
                <span>{animalName}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>

              {/* Pin Pointer Stem */}
              <div
                style={{ backgroundColor: pinBorder }}
                className="w-0.5 h-2 shadow-sm"
              />
            </div>
          );
        })}
      </div>

      {/* GOOGLE EARTH 3D COMPASS ROSE (TOP RIGHT) */}
      <div className={`absolute top-4 ${isFullscreen ? 'right-24 sm:right-28' : 'right-20 sm:right-24'} z-20 flex flex-col items-center gap-1.5 select-none pointer-events-auto`}>
        <button
          onClick={resetNorth}
          className="relative w-11 h-11 rounded-full bg-forest-950/90 hover:bg-forest-900 border border-gold-500/40 p-1 shadow-2xl backdrop-blur-md transition-all duration-200 group flex items-center justify-center cursor-pointer"
          title="3D Compass: Click to Reset North (0°)"
          aria-label="Reset North heading"
        >
          {/* Compass Rose Bezel */}
          <div className="absolute inset-1 rounded-full border border-forest-700/80" />

          {/* Cardinal N marker at top of dial */}
          <span className="absolute top-0.5 text-[8px] font-mono font-bold text-red-400 pointer-events-none">
            N
          </span>

          {/* Rotating Compass Needle */}
          <div
            style={{
              transform: `rotate(${-cameraHeading}deg)`,
              transition: 'transform 0.08s linear'
            }}
            className="w-full h-full relative flex items-center justify-center pointer-events-none"
          >
            {/* North Point (Red) */}
            <div className="absolute top-1.5 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[14px] border-b-red-500 filter drop-shadow" />
            {/* South Point (White/Silver) */}
            <div className="absolute bottom-1.5 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[14px] border-t-ivory-200 filter drop-shadow" />
            {/* Center Pivot Gem */}
            <div className="w-2 h-2 rounded-full bg-gold-400 shadow-sm z-10" />
          </div>
        </button>

        {/* Heading HUD readout */}
        <span className="px-1.5 py-0.5 rounded bg-forest-950/90 text-[8.5px] font-mono text-gold-300/80 border border-gold-500/20 shadow">
          {Math.round(cameraHeading)}° N
        </span>
      </div>

      {/* 360° CIRCULAR NAVIGATION & CONTROLS (BOTTOM RIGHT) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">

        {/* Top Control Bar: Quick Zoom Model Size, 360° Continuous Orbit Toggle & 3D Perspective Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Quick Zoom / Increase 3D Size Pill */}
          <div className="flex items-center gap-1 bg-forest-950/92 backdrop-blur-md p-1 rounded-xl border border-gold-500/40 text-[11px] font-mono shadow-xl">
            <button
              onClick={() => handleZoom(0.75)}
              className="px-2 py-0.5 rounded-lg bg-forest-900/90 hover:bg-gold-500/30 text-gold-300 font-bold hover:text-gold-100 transition-colors cursor-pointer flex items-center gap-1"
              title="Increase 3D Map Model Size (Zoom In)"
              aria-label="Increase 3D Map Model Size"
            >
              <ZoomIn className="w-3 h-3 text-gold-400" />
              <span>INCREASE</span>
            </button>
            <button
              onClick={() => handleZoom(1.3)}
              className="px-1.5 py-0.5 rounded-lg bg-forest-900/90 hover:bg-forest-800 text-ivory-300 font-bold hover:text-ivory-100 transition-colors cursor-pointer"
              title="Decrease 3D Map Model Size (Zoom Out)"
              aria-label="Decrease 3D Map Model Size"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
          </div>

          {/* 360° Continuous Auto-Orbit Button */}
          <button
            onClick={toggleAutoRotate}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold uppercase tracking-wider shadow-2xl backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoRotate
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-forest-950/92 hover:bg-forest-900 border-gold-500/40 text-gold-300'
            }`}
            title={isAutoRotate ? "Pause 360° Auto-Orbit" : "Start 360° Circular Orbit"}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '3.0s' }} />
            <span>{isAutoRotate ? '360° (ON)' : '360° ORBIT'}</span>
            {isAutoRotate && <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />}
          </button>

          {/* 3D Google Earth Perspective Switcher */}
          <button
            onClick={toggle2D3D}
            className="px-3 py-1.5 rounded-xl bg-forest-950/92 hover:bg-forest-900 border border-gold-500/40 text-gold-300 hover:text-gold-200 text-xs font-mono font-bold uppercase tracking-wider shadow-2xl backdrop-blur-md transition-all flex items-center gap-1.5 group cursor-pointer"
            title={is3DMode ? "3D View Active (Click for Overhead Angle)" : "Overhead View (Click for 3D Angle)"}
          >
            <Layers className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-12 transition-transform" />
            <span>3D VIEW</span>
          </button>
        </div>

        {/* Circular Direction Navigation Gizmo Stack */}
        <div className="flex items-center gap-1.5 bg-forest-950/92 backdrop-blur-xl p-1.5 rounded-2xl border border-gold-500/30 shadow-2xl">
          {/* Tilt Up */}
          <button
            onClick={handleTiltUp}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm cursor-pointer"
            title="Tilt Camera Up towards Horizon"
            aria-label="Tilt Camera Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Tilt Down */}
          <button
            onClick={handleTiltDown}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm cursor-pointer"
            title="Tilt Camera Down towards Overhead"
            aria-label="Tilt Camera Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Orbit in Circle Counter-Clockwise 45° */}
          <button
            onClick={() => handleRotate(1)}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm cursor-pointer"
            title="Orbit Counter-Clockwise in Circle 45°"
            aria-label="Orbit Left"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Orbit in Circle Clockwise 45° */}
          <button
            onClick={() => handleRotate(-1)}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm cursor-pointer"
            title="Orbit Clockwise in Circle 45°"
            aria-label="Orbit Right"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Fast 360° Circular Panoramic Sweep (2.0s) */}
          <button
            onClick={() => handle360Spin(1)}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-emerald-400 hover:text-emerald-300 transition-colors shadow-sm cursor-pointer"
            title="Perform Fast 360° Panoramic Circular Spin"
            aria-label="360 Spin"
          >
            <Orbit className="w-4 h-4" />
          </button>

          {/* Zoom In (+) */}
          <button
            onClick={() => handleZoom(0.75)}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out (-) */}
          <button
            onClick={() => handleZoom(1.35)}
            className="p-2 rounded-xl bg-forest-900/80 hover:bg-forest-800 text-ivory-100 hover:text-gold-400 transition-colors shadow-sm cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset Overview */}
          <button
            onClick={handleOverview}
            className="p-2 rounded-xl bg-gradient-to-r from-gold-500/20 to-gold-600/30 hover:bg-gold-500 text-gold-300 hover:text-forest-950 transition-colors shadow-sm font-bold text-xs cursor-pointer"
            title="Reset to Full Floating Sanctuary Diorama Overview"
            aria-label="Full Sanctuary Overview"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
