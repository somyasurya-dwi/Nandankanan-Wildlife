import fs from 'fs';
import path from 'path';
import assert from 'assert';

const projectRoot = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife');

console.log('===============================================================================');
console.log('VERIFYING: LIVE SHARING MOMENTS INBOX & COMMUNITY CONTRIBUTION FEATURE');
console.log('===============================================================================');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
  }
}

// 1. Backend Verification
test('Backend models.py has likes_count on WildlifeContribution', () => {
  const modelsSrc = fs.readFileSync(path.join(projectRoot, 'backend/wildlife/models.py'), 'utf8');
  assert(modelsSrc.includes('likes_count = models.PositiveIntegerField(default=0)'), 'Must define likes_count');
});

test('Backend serializers.py exposes likes_count in WildlifeContributionSerializer', () => {
  const serializersSrc = fs.readFileSync(path.join(projectRoot, 'backend/wildlife/serializers.py'), 'utf8');
  assert(serializersSrc.includes("'likes_count'"), 'Must include likes_count in serializer fields');
});

test('Backend views.py supports free community moments (amount=0) & like endpoint', () => {
  const viewsSrc = fs.readFileSync(path.join(projectRoot, 'backend/wildlife/views.py'), 'utf8');
  assert(viewsSrc.includes('def like_community_moment'), 'Must define like_community_moment view');
  assert(viewsSrc.includes('amount = int(request.data.get(\'amount\', 0))'), 'Must support amount 0 for free moments');
  assert(viewsSrc.includes('payment_method = \'community_free\''), 'Must designate community_free method');
});

test('Backend urls.py routes like_community_moment', () => {
  const urlsSrc = fs.readFileSync(path.join(projectRoot, 'backend/wildlife/urls.py'), 'utf8');
  assert(urlsSrc.includes('wallet/contributions/<str:contribution_id>/like/'), 'Must route contribution like URL');
});

// 2. Wallet Manager Verification
test('walletManager.js implements myMoments, likeContribution and free messages', () => {
  const walletMgrSrc = fs.readFileSync(path.join(projectRoot, 'frontend/src/utils/walletManager.js'), 'utf8');
  assert(walletMgrSrc.includes('MY_MESSAGES:'), 'Must have MY_MESSAGES storage key');
  assert(walletMgrSrc.includes('getMyMoments()'), 'Must implement getMyMoments');
  assert(walletMgrSrc.includes('likeContribution('), 'Must implement likeContribution');
  assert(walletMgrSrc.includes('isMomentLiked('), 'Must implement isMomentLiked');
  assert(walletMgrSrc.includes('parsedAmount > 0 ? paymentMethod : \'community_free\''), 'Must handle free community messages');
});

// 3. LiveSharingMoments Component Verification
test('LiveSharingMoments renders Inbox button with badge and Share Your Moment trigger', () => {
  const momentsSrc = fs.readFileSync(path.join(projectRoot, 'frontend/src/components/LiveSharingMoments.jsx'), 'utf8');
  assert(momentsSrc.includes('aria-label="Open Community Inbox"'), 'Must have accessible Inbox button');
  assert(momentsSrc.includes('Inbox'), 'Must have Inbox button text');
  assert(momentsSrc.includes('Share Your Moment ❤️'), 'Must have Share Your Moment button');
  assert(momentsSrc.includes('Community Wish 🌿'), 'Must support zero-amount community wishes');
  assert(momentsSrc.includes('onOpenInbox'), 'Must support onOpenInbox prop');
  assert(momentsSrc.includes('onOpenComposer'), 'Must support onOpenComposer prop');
});

// 4. CommunityMomentsModal Component Verification
test('CommunityMomentsModal component exists with composer, animal selection, and inbox feed', () => {
  const modalPath = path.join(projectRoot, 'frontend/src/components/CommunityMomentsModal.jsx');
  assert(fs.existsSync(modalPath), 'CommunityMomentsModal.jsx must exist');
  const modalSrc = fs.readFileSync(modalPath, 'utf8');

  // Requirements check
  assert(modalSrc.includes('Share My Moment'), 'Must have Share My Moment submit label');
  assert(modalSrc.includes('Community Inbox'), 'Must have Community Inbox tab');
  assert(modalSrc.includes('Share Anonymously'), 'Must have anonymous option');
  assert(modalSrc.includes('maxLength={250}'), 'Must enforce 250 character limit');
  assert(modalSrc.includes('QUICK_EMOJIS'), 'Must have quick emoji selection');
  assert(modalSrc.includes('royal-bengal-tiger'), 'Must support Tiger');
  assert(modalSrc.includes('asiatic-lion'), 'Must support Lion');
  assert(modalSrc.includes('elephant'), 'Must support Elephant');
  assert(modalSrc.includes('deer'), 'Must support Deer');
  assert(modalSrc.includes('bear'), 'Must support Bear');
  assert(modalSrc.includes('birds'), 'Must support Birds');
  assert(modalSrc.includes('Free ✨'), 'Must support free 0 INR option');
  assert(modalSrc.includes('handleCheerMoment'), 'Must support liking community moments');
});

// 5. LiveCameraPlayer Integration
test('LiveCameraPlayer integrates CommunityMomentsModal and passes handlers', () => {
  const playerSrc = fs.readFileSync(path.join(projectRoot, 'frontend/src/components/LiveCameraPlayer.jsx'), 'utf8');
  assert(playerSrc.includes('CommunityMomentsModal'), 'Must import CommunityMomentsModal');
  assert(playerSrc.includes('onOpenInbox={() =>'), 'Must pass onOpenInbox to LiveSharingMoments');
  assert(playerSrc.includes('onOpenComposer={(targetAnimal) =>'), 'Must pass onOpenComposer to LiveSharingMoments');
  assert(playerSrc.includes('<CommunityMomentsModal'), 'Must mount CommunityMomentsModal component');
});

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / 8 TESTS PASSED (${(passed/8*100).toFixed(0)}% SUCCESS)`);
console.log('===============================================================================');
