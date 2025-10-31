const fs = require('fs');
const path = require('path');

// Scale types and their interval patterns
const SCALE_TYPES = {
  // Basic Scales
  'major': { intervals: [0, 2, 4, 5, 7, 9, 11], name: 'Major' },
  'natural minor': { intervals: [0, 2, 3, 5, 7, 8, 10], name: 'Natural Minor' },
  'harmonic minor': { intervals: [0, 2, 3, 5, 7, 8, 11], name: 'Harmonic Minor' },
  'melodic minor': { intervals: [0, 2, 3, 5, 7, 9, 11], name: 'Melodic Minor' },
  'minor pentatonic': { intervals: [0, 3, 5, 7, 10], name: 'Minor Pentatonic' },
  'major pentatonic': { intervals: [0, 2, 4, 7, 9], name: 'Major Pentatonic' },
  'blues': { intervals: [0, 3, 5, 6, 7, 10], name: 'Blues' },
  'major blues': { intervals: [0, 2, 3, 4, 7, 9], name: 'Major Blues' },
  'pentatonic blues': { intervals: [0, 3, 5, 6, 7, 10], name: 'Pentatonic Blues' },
  'whole tone': { intervals: [0, 2, 4, 6, 8, 10], name: 'Whole Tone' },
  'augmented': { intervals: [0, 3, 4, 7, 8, 11], name: 'Augmented' },
  
  // Diminished
  'diminished (halftone - wholetone)': { intervals: [0, 1, 3, 4, 6, 7, 9, 10], name: 'Diminished (H-W)' },
  'diminished (wholetone - halftone)': { intervals: [0, 2, 3, 5, 6, 8, 9, 11], name: 'Diminished (W-H)' },
  
  // Modes
  'ionian': { intervals: [0, 2, 4, 5, 7, 9, 11], name: 'Ionian' },
  'dorian': { intervals: [0, 2, 3, 5, 7, 9, 10], name: 'Dorian' },
  'phrygian': { intervals: [0, 1, 3, 5, 7, 8, 10], name: 'Phrygian' },
  'lydian': { intervals: [0, 2, 4, 6, 7, 9, 11], name: 'Lydian' },
  'mixolydian': { intervals: [0, 2, 4, 5, 7, 9, 10], name: 'Mixolydian' },
  'aeolian': { intervals: [0, 2, 3, 5, 7, 8, 10], name: 'Aeolian' },
  'locrian': { intervals: [0, 1, 3, 5, 6, 8, 10], name: 'Locrian' },
  
  // Other scales
  'diatonic': { intervals: [0, 2, 4, 5, 7, 9, 11], name: 'Diatonic' },
  'dominant pentatonic': { intervals: [0, 2, 4, 7, 10], name: 'Dominant Pentatonic' },
  'pentatonic neutral': { intervals: [0, 2, 5, 7, 10], name: 'Pentatonic Neutral' },
  'altered': { intervals: [0, 1, 3, 4, 6, 8, 10], name: 'Altered' },
  'bebop major': { intervals: [0, 2, 4, 5, 7, 8, 9, 11], name: 'Bebop Major' },
  'bebop minor': { intervals: [0, 2, 3, 5, 7, 8, 9, 10], name: 'Bebop Minor' },
  'bebop dominant': { intervals: [0, 2, 4, 5, 7, 9, 10, 11], name: 'Bebop Dominant' },
  'bebop half diminished': { intervals: [0, 1, 3, 5, 6, 7, 8, 10], name: 'Bebop Half Diminished' },
};

// Note names
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Get note index
const getNoteIndex = (noteName) => {
  const cleanNote = noteName.replace(/[0-9]/g, '').trim();
  const index = NOTES.findIndex(n => n === cleanNote);
  if (index !== -1) return index;
  return NOTES_FLATS.findIndex(n => n === cleanNote);
};

// Get note name from index
const getNoteName = (index, preferSharp = true) => {
  return preferSharp ? NOTES[index] : NOTES_FLATS[index];
};

// Calculate scale notes
const calculateScaleNotes = (root, scaleType) => {
  const rootIndex = getNoteIndex(root);
  if (rootIndex === -1) return null;
  
  const scaleDef = SCALE_TYPES[scaleType];
  if (!scaleDef) return null;
  
  const notes = scaleDef.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    const preferSharp = root.includes('#');
    return getNoteName(noteIndex, preferSharp);
  });
  
  const intervals = scaleDef.intervals.map((i, idx) => {
    if (idx === 0) return '1';
    if (i === 1) return 'b2';
    if (i === 2) return '2';
    if (i === 3) return 'b3';
    if (i === 4) return '3';
    if (i === 5) return '4';
    if (i === 6) return '#4' || 'b5';
    if (i === 7) return '5';
    if (i === 8) return 'b6';
    if (i === 9) return '6';
    if (i === 10) return 'b7';
    if (i === 11) return '7';
    return i.toString();
  });
  
  return { notes, intervals, name: scaleDef.name };
};

// Generate all scales
const generateAllScales = () => {
  const scales = [];
  
  const rootNotes = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
  ];
  
  const scaleTypeKeys = Object.keys(SCALE_TYPES);
  
  rootNotes.forEach(root => {
    scaleTypeKeys.forEach(scaleType => {
      const scaleInfo = calculateScaleNotes(root, scaleType);
      if (scaleInfo) {
        const scaleName = `${root} ${scaleInfo.name}`;
        const id = `${root.toLowerCase().replace(/#/g, 's').replace(/b/g, 'b')}-${scaleType.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase()}`;
        
        scales.push({
          id,
          key: root,
          type: scaleType,
          name: scaleName,
          notes: scaleInfo.notes,
          intervals: scaleInfo.intervals,
          description: `The ${scaleName} scale has the notes ${scaleInfo.notes.join(', ')}.`,
        });
      }
    });
  });
  
  return scales;
};

// Main execution
const main = () => {
  console.log('Generating all scales...');
  const allScales = generateAllScales();
  console.log(`Generated ${allScales.length} scales`);
  
  // Deduplicate by id
  const scaleMap = new Map();
  allScales.forEach(scale => {
    if (!scaleMap.has(scale.id)) {
      scaleMap.set(scale.id, scale);
    }
  });
  
  const uniqueScales = Array.from(scaleMap.values());
  console.log(`After deduplication: ${uniqueScales.length} unique scales`);
  
  // Save to file
  const outputPath = path.join(__dirname, '../data/scales.json');
  fs.writeFileSync(outputPath, JSON.stringify(uniqueScales, null, 2), 'utf-8');
  console.log(`Scales saved to: ${outputPath}`);
  
  // Print summary by type
  const byType = {};
  uniqueScales.forEach(scale => {
    if (!byType[scale.type]) byType[scale.type] = 0;
    byType[scale.type]++;
  });
  
  console.log('\nScales by type:');
  Object.keys(byType).sort().forEach(type => {
    console.log(`  ${type}: ${byType[type]} scales`);
  });
};

if (require.main === module) {
  main();
}

module.exports = { generateAllScales };

