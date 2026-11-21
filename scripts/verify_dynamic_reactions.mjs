import fs from 'fs';
import path from 'path';
import assert from 'assert';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

console.log('===============================================================================');
console.log('VERIFYING: DYNAMIC ANIMAL-SPECIFIC REACTION SYSTEM WITH REALISTIC 3D ICONS');
console.log('===============================================================================');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
  }
}

// 1. Verify reactionManager.js exists and exports exact mappings
const reactionManagerPath = path.join(projectRoot, 'frontend/src/utils/reactionManager.js');
test('reactionManager.js exists', () => {
  assert(fs.existsSync(reactionManagerPath), 'File must exist');
});

const rmSrc = fs.readFileSync(reactionManagerPath, 'utf8');

// Required reactions test per animal
const expectedMappings = {
  'royal-bengal-tiger': ['Tiger Love', 'Love', 'Paw Prints', 'Meat Appreciation', 'Amazing', 'Exciting'],
  'asiatic-lion': ['Lion Pride', 'King of Jungle', 'Love', 'Paw Prints', 'Roar', 'Applause'],
  'asian-elephant': ['Elephant Love', 'Support', 'Nature', 'Care', 'Cute', 'Water Love'],
  'spotted-deer': ['Deer Love', 'Beautiful', 'Nature', 'Green Earth', 'Love', 'Magical'],
  'sloth-bear': ['Bear Love', 'Paw Prints', 'Honey Love', 'Cute', 'Support', 'Amazing'],
  'birds': ['Bird Love', 'Beautiful', 'Colorful', 'Green Earth', 'Nature', 'Wonderful']
};

Object.entries(expectedMappings).forEach(([slug, reactionNames]) => {
  test(`Animal '${slug}' has all 6 user-specified reactions`, () => {
    assert(rmSrc.includes(`'${slug}': [`), `Must define mapping for ${slug}`);
    reactionNames.forEach(name => {
      assert(rmSrc.includes(`name: '${name}'`), `Must include reaction '${name}' in mapping for ${slug}`);
    });
  });
});

// 2. Verify Realistic3DIcon.jsx component
const iconCompPath = path.join(projectRoot, 'frontend/src/components/reactions/Realistic3DIcon.jsx');
test('Realistic3DIcon.jsx exists and defines 3D illustrations', () => {
  assert(fs.existsSync(iconCompPath), 'Realistic3DIcon.jsx must exist');
  const iconSrc = fs.readFileSync(iconCompPath, 'utf8');
  
  const requiredIcons = [
    'tiger', 'lion', 'elephant', 'deer', 'bear', 'peacock',
    'heart_red', 'heart_green', 'paw', 'meat', 'heart_eyes',
    'fire', 'crown', 'applause', 'leaf', 'heart_hands',
    'cute_face', 'water_drop', 'cherry_blossom', 'butterfly',
    'sparkles', 'honey_pot', 'rainbow', 'tree'
  ];

  requiredIcons.forEach(key => {
    assert(iconSrc.includes(`case '${key}':`), `Realistic3DIcon must implement '${key}' 3D illustration`);
  });

  assert(iconSrc.includes('filter="url(#shadow_3d)"'), 'Must utilize volumetric 3D lighting and shadow filters');
  assert(iconSrc.includes('<radialGradient'), 'Must use 3D radial gradients');
  assert(iconSrc.includes('<linearGradient'), 'Must use 3D linear gradients');
});

// 3. Verify ExpandableReactionPicker.jsx component
const pickerPath = path.join(projectRoot, 'frontend/src/components/reactions/ExpandableReactionPicker.jsx');
test('ExpandableReactionPicker.jsx exists and supports categories and selection', () => {
  assert(fs.existsSync(pickerPath), 'ExpandableReactionPicker.jsx must exist');
  const pickerSrc = fs.readFileSync(pickerPath, 'utf8');
  assert(pickerSrc.includes('Realistic3DIcon'), 'Must use Realistic3DIcon in picker');
  assert(pickerSrc.includes('ALL_REACTIONS_CATALOG'), 'Must use full catalog');
  assert(pickerSrc.includes('onSelectReaction'), 'Must provide selection callback');
});

// 4. Verify LiveCameraPlayer.jsx integration
const playerPath = path.join(projectRoot, 'frontend/src/components/LiveCameraPlayer.jsx');
test('LiveCameraPlayer.jsx connects dynamic animal reactions smoothly with streamlined dock', () => {
  const playerSrc = fs.readFileSync(playerPath, 'utf8');
  assert(playerSrc.includes('Realistic3DIcon'), 'Must import Realistic3DIcon');
  assert(playerSrc.includes('reactionManager'), 'Must import reactionManager');
  assert(playerSrc.includes('activeReactions = useMemo('), 'Must compute active reactions dynamically from animal');
  assert(playerSrc.includes('reactionManager.getReactionsForAnimal(animal)'), 'Must resolve reactions for selected animal');
  assert(playerSrc.includes('reactionManager.getAnimalCounts(animal)'), 'Must load animal reaction counts');
  assert(playerSrc.includes('<Realistic3DIcon'), 'Must render Realistic3DIcon in dock');
  assert(playerSrc.includes('popularReactionId'), 'Must highlight most popular reaction with HOT tag');
  assert(!playerSrc.includes('<ExpandableReactionPicker'), 'Must remove expandable reaction picker modal');
  assert(!playerSrc.includes('setIsReactionPickerOpen'), 'Must remove reaction picker open toggle');
});

// 5. Verify Backend Integration
const modelsPath = path.join(projectRoot, 'backend/wildlife/models.py');
const viewsPath = path.join(projectRoot, 'backend/wildlife/views.py');
const urlsPath = path.join(projectRoot, 'backend/wildlife/urls.py');

test('Backend models, serializers, views and URLs define reaction endpoints', () => {
  const modelsSrc = fs.readFileSync(modelsPath, 'utf8');
  assert(modelsSrc.includes('class AnimalReaction(models.Model):'), 'Must define AnimalReaction model');
  assert(modelsSrc.includes('animal_slug = models.CharField'), 'Must index animal_slug');

  const viewsSrc = fs.readFileSync(viewsPath, 'utf8');
  assert(viewsSrc.includes('def get_animal_reactions(request, animal_slug):'), 'Must implement get_animal_reactions view');
  assert(viewsSrc.includes('def send_animal_reaction(request, animal_slug):'), 'Must implement send_animal_reaction view');

  const urlsSrc = fs.readFileSync(urlsPath, 'utf8');
  assert(urlsSrc.includes("path('reactions/<slug:animal_slug>/'"), 'Must route GET animal-reactions');
  assert(urlsSrc.includes("path('reactions/<slug:animal_slug>/send/'"), 'Must route POST send-animal-reaction');
});

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / ${total} TESTS PASSED (${((passed/total)*100).toFixed(0)}% SUCCESS)`);
console.log('===============================================================================');
