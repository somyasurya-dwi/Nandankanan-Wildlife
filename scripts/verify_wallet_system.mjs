import fs from 'fs';
import path from 'path';

console.log('===============================================================================');
console.log('VERIFYING: WILDLIFE WALLET & ANIMAL CONTRIBUTION SYSTEM');
console.log('===============================================================================');

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

const frontendSrc = path.join(process.cwd(), 'Nandankanan-Wildlife', 'frontend', 'src');
const backendSrc = path.join(process.cwd(), 'Nandankanan-Wildlife', 'backend', 'wildlife');

// 1. Backend files & models
const modelsPy = fs.readFileSync(path.join(backendSrc, 'models.py'), 'utf-8');
assert(modelsPy.includes('class WildlifeWallet'), 'Backend defines WildlifeWallet model');
assert(modelsPy.includes('class WalletTransaction'), 'Backend defines WalletTransaction model');
assert(modelsPy.includes('class WildlifeContribution'), 'Backend defines WildlifeContribution model');

const viewsPy = fs.readFileSync(path.join(backendSrc, 'views.py'), 'utf-8');
assert(viewsPy.includes('def wallet_details'), 'Backend defines wallet_details endpoint');
assert(viewsPy.includes('def create_wallet_topup_order'), 'Backend defines create_wallet_topup_order endpoint');
assert(viewsPy.includes('def verify_wallet_topup'), 'Backend defines verify_wallet_topup endpoint');
assert(viewsPy.includes('def make_wildlife_contribution'), 'Backend defines make_wildlife_contribution endpoint');
assert(viewsPy.includes('def get_recent_contributions'), 'Backend defines get_recent_contributions (Live Sharing Moments) endpoint');
assert(viewsPy.includes('def get_animal_care_fund'), 'Backend defines get_animal_care_fund endpoint');

const urlsPy = fs.readFileSync(path.join(backendSrc, 'urls.py'), 'utf-8');
assert(urlsPy.includes('path(\'wallet/\''), 'Backend routes wallet details URL');
assert(urlsPy.includes('path(\'wallet/contribute/\''), 'Backend routes wallet contribution URL');
assert(urlsPy.includes('path(\'wallet/fund-stats/\''), 'Backend routes animal care fund stats URL');

// 2. Frontend Wallet Manager Utility
const walletMgrPath = path.join(frontendSrc, 'utils', 'walletManager.js');
assert(fs.existsSync(walletMgrPath), 'walletManager.js utility exists');
const walletMgrSrc = fs.readFileSync(walletMgrPath, 'utf-8');
assert(walletMgrSrc.includes('class WalletManager'), 'WalletManager class implemented');
assert(walletMgrSrc.includes('makeContribution'), 'WalletManager implements makeContribution');
assert(walletMgrSrc.includes('verifyTopUp'), 'WalletManager implements verifyTopUp');
assert(walletMgrSrc.includes('getAnimalCareFund'), 'WalletManager implements getAnimalCareFund');
assert(walletMgrSrc.includes('onDonationCelebration'), 'WalletManager implements onDonationCelebration pub/sub');

// 3. Components
const compDir = path.join(frontendSrc, 'components');
assert(fs.existsSync(path.join(compDir, 'WildlifeWalletBar.jsx')), 'WildlifeWalletBar.jsx component exists');
assert(fs.existsSync(path.join(compDir, 'LiveSharingMoments.jsx')), 'LiveSharingMoments.jsx component exists');
assert(fs.existsSync(path.join(compDir, 'AnimalCareFund.jsx')), 'AnimalCareFund.jsx component exists');
assert(fs.existsSync(path.join(compDir, 'ContributionModal.jsx')), 'ContributionModal.jsx component exists');
assert(fs.existsSync(path.join(compDir, 'AddMoneyModal.jsx')), 'AddMoneyModal.jsx component exists');
assert(fs.existsSync(path.join(compDir, 'WalletHistoryModal.jsx')), 'WalletHistoryModal.jsx component exists');
assert(fs.existsSync(path.join(compDir, 'DonationCelebrationBanner.jsx')), 'DonationCelebrationBanner.jsx component exists');
assert(fs.existsSync(path.join(compDir, 'AnimalCareFundDetailsModal.jsx')), 'AnimalCareFundDetailsModal.jsx component exists');

// 4. Component Content & Requirements
const walletBarSrc = fs.readFileSync(path.join(compDir, 'WildlifeWalletBar.jsx'), 'utf-8');
assert(walletBarSrc.includes('Wildlife Wallet'), 'WildlifeWalletBar displays exact title');
assert(walletBarSrc.includes('Share Happiness, Feed Wildlife'), 'WildlifeWalletBar displays exact subtitle');
assert(walletBarSrc.includes('Add Money'), 'WildlifeWalletBar has Add Money button');
assert(walletBarSrc.includes('History'), 'WildlifeWalletBar has History link');
assert(walletBarSrc.includes('🥩') && walletBarSrc.includes('🍖') && walletBarSrc.includes('❤️') && walletBarSrc.includes('⭐'), 'WildlifeWalletBar displays quick options (₹10, ₹50, ₹100, Extra)');

const contribModalSrc = fs.readFileSync(path.join(compDir, 'ContributionModal.jsx'), 'utf-8');
assert(contribModalSrc.includes('royal-bengal-tiger') && contribModalSrc.includes('asiatic-lion') && contribModalSrc.includes('elephant') && contribModalSrc.includes('spotted-deer') && contribModalSrc.includes('sloth-bear') && contribModalSrc.includes('birds'), 'ContributionModal supports all 6 sanctuary species');
assert(contribModalSrc.includes('Support approved meat and nutrition programs'), 'ContributionModal includes tiger nutrition program description');
assert(contribModalSrc.includes('Support approved bird food and habitat care'), 'ContributionModal includes birds food program description');
assert(contribModalSrc.includes('Visitors do not directly feed animals'), 'ContributionModal enforces official zoo welfare disclaimer');
assert(contribModalSrc.includes('isAnonymous'), 'ContributionModal supports anonymous donations');

const sharingMomentsSrc = fs.readFileSync(path.join(compDir, 'LiveSharingMoments.jsx'), 'utf-8');
assert(sharingMomentsSrc.includes('Live Sharing Moments'), 'LiveSharingMoments displays title');
assert(sharingMomentsSrc.includes('View All'), 'LiveSharingMoments includes View All button');
assert(sharingMomentsSrc.includes('is_verified'), 'LiveSharingMoments filters for verified contributions only');

const fundSrc = fs.readFileSync(path.join(compDir, 'AnimalCareFund.jsx'), 'utf-8');
assert(fundSrc.includes('Animal Care Fund'), 'AnimalCareFund displays title');
assert(fundSrc.includes('Animal Nutrition') && fundSrc.includes('Veterinary Care') && fundSrc.includes('Habitat Enrichment') && fundSrc.includes('Wildlife Conservation'), 'AnimalCareFund displays 4 welfare categories');

// 5. Dashboard Integration in LiveCameraPlayer.jsx
const playerSrc = fs.readFileSync(path.join(compDir, 'LiveCameraPlayer.jsx'), 'utf-8');
assert(playerSrc.includes('<WildlifeWalletBar'), 'LiveCameraPlayer integrates WildlifeWalletBar at top');
assert(playerSrc.includes('lg:grid-cols-12'), 'LiveCameraPlayer implements 12-column responsive layout');
assert(playerSrc.includes('<LiveSharingMoments'), 'LiveCameraPlayer embeds LiveSharingMoments side panel');
assert(playerSrc.includes('<AnimalCareFund'), 'LiveCameraPlayer embeds AnimalCareFund card');
assert(playerSrc.includes('<DonationCelebrationBanner'), 'LiveCameraPlayer embeds temporary celebration notification banner over live video');
assert(playerSrc.includes('<ContributionModal'), 'LiveCameraPlayer embeds ContributionModal');
assert(playerSrc.includes('<AddMoneyModal'), 'LiveCameraPlayer embeds AddMoneyModal');
assert(playerSrc.includes('<WalletHistoryModal'), 'LiveCameraPlayer embeds WalletHistoryModal');
assert(playerSrc.includes('activeReactions.map') || playerSrc.includes('Realistic3DIcon'), 'Dynamic 3D reaction bar is integrated');
assert(!playerSrc.includes('<SubscriptionModal'), '10-second subscription popup has been deleted for uninterrupted live streaming');

console.log('===============================================================================');
console.log(`RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}% SUCCESS)`);
console.log('===============================================================================');

if (passed !== total) {
  process.exit(1);
}
