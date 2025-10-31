const fs = require('fs');
const path = require('path');

const CHORDS_FILE = path.join(__dirname, '../data/chords.json');

if (fs.existsSync(CHORDS_FILE)) {
  const chords = JSON.parse(fs.readFileSync(CHORDS_FILE, 'utf-8'));
  console.log(`✅ Found ${chords.length} chords in data/chords.json`);
  console.log('Sample chords:', chords.slice(0, 5).map(c => c.symbol).join(', '));
} else {
  console.log('❌ No chords data found. Run: npm run scrape');
  process.exit(1);
}

