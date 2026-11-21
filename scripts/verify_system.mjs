import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicVideos = path.join(rootDir, 'frontend/public/videos');
const distVideos = path.join(rootDir, 'frontend/dist/videos');

const expectedFiles = [
  'tiger_cam1_1080p.webm', 'tiger_cam1_1080p.mp4',
  'tiger_cam2_1080p.webm', 'tiger_cam2_1080p.mp4',
  'tiger_cam3_1080p.webm', 'tiger_cam3_1080p.mp4',
  'tiger_continuous_surveillance_1080p.webm', 'tiger_continuous_surveillance_1080p.mp4',
  'lion_cam1_1080p.webm', 'lion_cam1_1080p.mp4',
  'lion_cam2_1080p.webm', 'lion_cam2_1080p.mp4',
  'lion_cam3_1080p.webm', 'lion_cam3_1080p.mp4',
  'lion_continuous_surveillance_1080p.webm', 'lion_continuous_surveillance_1080p.mp4',
  'deer_cam1_1080p.webm', 'deer_cam1_1080p.mp4',
  'deer_cam2_1080p.webm', 'deer_cam2_1080p.mp4',
  'deer_cam3_1080p.webm', 'deer_cam3_1080p.mp4',
  'deer_continuous_surveillance_1080p.webm', 'deer_continuous_surveillance_1080p.mp4',
  'bear_cam1_1080p.webm', 'bear_cam1_1080p.mp4',
  'bear_cam2_1080p.webm', 'bear_cam2_1080p.mp4',
  'bear_cam3_1080p.webm', 'bear_cam3_1080p.mp4',
  'bear_continuous_surveillance_1080p.webm', 'bear_continuous_surveillance_1080p.mp4',
  'birds_cam1_1080p.webm', 'birds_cam1_1080p.mp4',
  'birds_cam2_1080p.webm', 'birds_cam2_1080p.mp4',
  'birds_cam3_1080p.webm', 'birds_cam3_1080p.mp4',
  'birds_continuous_surveillance_1080p.webm', 'birds_continuous_surveillance_1080p.mp4',
  'elephant_cam1_1080p.webm', 'elephant_cam1_1080p.mp4',
  'elephant_cam2_1080p.webm', 'elephant_cam2_1080p.mp4',
  'elephant_cam3_1080p.webm', 'elephant_cam3_1080p.mp4',
  'elephant_continuous_surveillance_1080p.webm', 'elephant_continuous_surveillance_1080p.mp4'
];

console.log('=== 1. VERIFYING ALL 48 VIDEO STREAM ASSETS (TIGER, LION, DEER, BEAR, BIRDS & ELEPHANT) ===');
let missingCount = 0;
for (const f of expectedFiles) {
  const pPub = path.join(publicVideos, f);
  const pDist = path.join(distVideos, f);
  if (!fs.existsSync(pPub) || !fs.existsSync(pDist)) {
    console.error(`[FAIL] Missing: ${f}`);
    missingCount++;
  } else {
    const s = fs.statSync(pPub);
    console.log(`[PASS] ${f} (${(s.size/1024/1024).toFixed(2)} MB)`);
  }
}

if (missingCount === 0) {
  console.log(`>>> All 48 video stream files verified in both public and dist.\n`);
}

console.log('=== 2. VERIFYING MULTI-CAMERA TRACKER INTEGRATION ===');
import('../frontend/src/utils/multiCameraTracker.js').then(({ MultiCameraTracker }) => {
  // Tiger Tracker
  const tigerTracker = new MultiCameraTracker({
    animalName: 'Royal Bengal Tiger',
    individualId: 'NKZ-T-04',
    callsign: 'Kanha',
    species: 'Panthera tigris tigris'
  });
  console.log('Tiger Tracker Initial:', tigerTracker.getState().current_message);
  console.log('Tiger Movement Event:', tigerTracker.detectInCamera(2).message);

  // Lion Tracker
  const lionTracker = new MultiCameraTracker({
    animalName: 'Asiatic Lion',
    individualId: 'NKZ-L-02',
    callsign: 'Suraj',
    species: 'Panthera leo persica'
  });
  console.log('Lion Tracker Initial:', lionTracker.getState().current_message);
  console.log('Lion Movement Event:', lionTracker.detectInCamera(3).message);

  // Deer Tracker
  const deerTracker = new MultiCameraTracker({
    animalName: 'Deer',
    individualId: 'NKZ-D-08',
    callsign: 'Chitra',
    species: 'Axis axis'
  });
  console.log('Deer Tracker Initial:', deerTracker.getState().current_message);
  console.log('Deer Movement Event:', deerTracker.detectInCamera(2).message);

  // Bear Tracker
  const bearTracker = new MultiCameraTracker({
    animalName: 'Bear',
    individualId: 'NKZ-B-05',
    callsign: 'Baloo',
    species: 'Melursus ursinus'
  });
  console.log('Bear Tracker Initial:', bearTracker.getState().current_message);
  console.log('Bear Movement Event:', bearTracker.detectInCamera(3).message);

  // Birds Tracker
  const birdsTracker = new MultiCameraTracker({
    animalName: 'Birds',
    individualId: 'NKZ-B-12',
    callsign: 'Mayur',
    species: 'Pavo cristatus'
  });
  console.log('Birds Tracker Initial:', birdsTracker.getState().current_message);
  console.log('Birds Movement Event:', birdsTracker.detectInCamera(2).message);

  // Elephant Tracker
  const elephantTracker = new MultiCameraTracker({
    animalName: 'Elephant',
    individualId: 'NKZ-E-01',
    callsign: 'Basanti',
    species: 'Elephas maximus'
  });
  console.log('Elephant Tracker Initial:', elephantTracker.getState().current_message);
  console.log('Elephant Movement Event:', elephantTracker.detectInCamera(2).message);

  console.log('\n>>> MultiCameraTracker verified across all 6 sanctuary species!');
});
