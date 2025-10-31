const fs = require('fs');
const path = require('path');

// Chord intervals mapping - determines notes based on root and type
const CHORD_INTERVALS = {
  // Major
  '': { intervals: [0, 4, 7], name: 'major' }, // C = C E G
  
  // Minor
  'm': { intervals: [0, 3, 7], name: 'minor' }, // Cm = C Eb G
  
  // Diminished
  'dim': { intervals: [0, 3, 6], name: 'diminished' }, // Cdim = C Eb Gb
  
  // Augmented
  'aug': { intervals: [0, 4, 8], name: 'augmented' }, // Caug = C E G#
  
  // Major 7th
  'maj7': { intervals: [0, 4, 7, 11], name: 'major seventh' }, // Cmaj7 = C E G B
  
  // Dominant 7th
  '7': { intervals: [0, 4, 7, 10], name: 'dominant seventh' }, // C7 = C E G Bb
  
  // Minor 7th
  'm7': { intervals: [0, 3, 7, 10], name: 'minor seventh' }, // Cm7 = C Eb G Bb
  
  // Diminished 7th
  'dim7': { intervals: [0, 3, 6, 9], name: 'diminished seventh' }, // Cdim7 = C Eb Gb A
  
  // Minor Major 7th
  'm(maj7)': { intervals: [0, 3, 7, 11], name: 'minor major seventh' }, // Cm(maj7) = C Eb G B
  
  // Minor 7th flat 5th
  'm7b5': { intervals: [0, 3, 6, 10], name: 'minor seventh flat five' }, // Cm7b5 = C Eb Gb Bb
  
  // Suspended 2nd
  'sus2': { intervals: [0, 2, 7], name: 'suspended second' }, // Csus2 = C D G
  
  // Suspended 4th
  'sus4': { intervals: [0, 5, 7], name: 'suspended fourth' }, // Csus4 = C F G
  
  // 6th
  '6': { intervals: [0, 4, 7, 9], name: 'sixth' }, // C6 = C E G A
  
  // 6th/9th
  '6/9': { intervals: [0, 4, 7, 9, 14], name: 'sixth ninth' }, // C6/9 = C E G A D
  
  // 9th
  '9': { intervals: [0, 4, 7, 10, 14], name: 'dominant ninth' }, // C9 = C E G Bb D
  
  // 11th
  '11': { intervals: [0, 4, 7, 10, 14, 17], name: 'dominant eleventh' }, // C11 = C E G Bb D F
  
  // 13th
  '13': { intervals: [0, 4, 7, 10, 14, 21], name: 'dominant thirteenth' }, // C13 = C E G Bb D A
  
  // 5th (Power chord)
  '5': { intervals: [0, 7], name: 'fifth' }, // C5 = C G
};

// Note names (chromatic scale)
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Get note index from note name
const getNoteIndex = (noteName) => {
  const cleanNote = noteName.replace(/[0-9]/g, '').trim();
  const index = NOTES.findIndex(n => n === cleanNote);
  if (index !== -1) return index;
  return NOTES_FLATS.findIndex(n => n === cleanNote);
};

// Get note name from index (prefer sharps)
const getNoteName = (index, preferSharp = true) => {
  return preferSharp ? NOTES[index] : NOTES_FLATS[index];
};

// Calculate notes from root and chord type
const calculateChordNotes = (root, chordType) => {
  const rootIndex = getNoteIndex(root);
  if (rootIndex === -1) return null;
  
  const chordDef = CHORD_INTERVALS[chordType];
  if (!chordDef) return null;
  
  const notes = chordDef.intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    // Use sharp for # notes, flat for b notes in root
    // But also check if note would naturally be flat (Db, Eb, Gb, Ab, Bb)
    const preferSharp = root.includes('#') || (!root.includes('b') && !root.includes('#'));
    // For flat roots (Db, Eb, etc.), prefer flats for related notes
    const shouldUseFlat = root.includes('b') || ['Db', 'Eb', 'Gb', 'Ab', 'Bb'].includes(getNoteName(noteIndex, false));
    return getNoteName(noteIndex, !shouldUseFlat);
  });
  
  const intervals = chordDef.intervals.map((i, idx) => {
    if (idx === 0) return '1';
    if (i === 2) return '2';
    if (i === 3) return 'b3';
    if (i === 4) return '3';
    if (i === 5) return '4';
    if (i === 6) return 'b5';
    if (i === 7) return '5';
    if (i === 8) return '#5';
    if (i === 9) return '6';
    if (i === 10) return 'b7';
    if (i === 11) return '7';
    if (i === 14) return '9';
    if (i === 17) return '11';
    if (i === 21) return '13';
    return i.toString();
  });
  
  return { notes, intervals, fullName: chordDef.name };
};

// Generate all chords
const generateAllChords = () => {
  const chords = [];
  
  // Root notes from the provided list
  const rootNotes = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
  ];
  
  // Chord types from the provided list - in order
  const chordTypes = [
    '',      // major (no suffix)
    'm',     // minor
    'dim',   // diminished
    'aug',   // augmented
    'maj7',  // major seventh
    '7',     // dominant seventh
    'm7',    // minor seventh
    'dim7',  // diminished seventh
    'm(maj7)', // minor major seventh
    'm7b5',  // minor seventh flat five
    'sus2',  // suspended second
    'sus4',  // suspended fourth
    '6',     // sixth
    '6/9',   // sixth ninth
    '9',     // dominant ninth
    '11',    // dominant eleventh
    '13',    // dominant thirteenth
    '5',     // fifth (power chord)
  ];
  
  rootNotes.forEach(root => {
    chordTypes.forEach(chordType => {
      const chordInfo = calculateChordNotes(root, chordType);
      if (chordInfo) {
        // Build symbol correctly - root + chord type
        let symbol = root;
        if (chordType) {
          symbol += chordType;
        }
        
        // Generate full name
        let fullName = `${root} ${chordInfo.fullName}`;
        if (!chordType) {
          fullName = `${root} major`;
        }
        
        // Generate URL - encode special characters
        const urlSymbol = encodeURIComponent(symbol).replace(/%23/g, '%23').replace(/\//g, '%5C');
        const url = `https://www.scales-chords.com/chord/piano/${urlSymbol}`;
        
        // Generate image URL - convert # to s, / to _
        const imageSymbol = symbol.replace(/#/g, 's').replace(/\//g, '_').replace(/\(/g, '').replace(/\)/g, '');
        const imageNotes = chordInfo.notes.join('-').replace(/#/g, 's').replace(/b/g, 'b');
        const imageUrl = `https://www.scales-chords.com/chord-charts/piano-${imageSymbol.toLowerCase()}-c-n-l-${imageNotes}.jpg`;
        
        chords.push({
          symbol,
          fullName,
          description: `The ${fullName} Chord for Piano has the notes ${chordInfo.notes.join(' ')} and interval structure ${chordInfo.intervals.join(' ')}.`,
          notes: chordInfo.notes,
          intervals: chordInfo.intervals,
          alternateSymbols: [],
          inversions: [],
          relatedChords: [],
          imageUrl,
          imageLocal: null,
          url,
        });
      }
    });
  });
  
  return chords;
};

// Main execution
const main = () => {
  console.log('Generating all piano chords...');
  const allChords = generateAllChords();
  console.log(`Generated ${allChords.length} total chords`);
  
  // Deduplicate chords by symbol
  const chordMap = new Map();
  allChords.forEach(chord => {
    if (!chordMap.has(chord.symbol)) {
      chordMap.set(chord.symbol, chord);
    }
  });
  
  const uniqueChords = Array.from(chordMap.values());
  console.log(`After deduplication: ${uniqueChords.length} unique chords`);
  
  // Sort chords by root note, then by type
  uniqueChords.sort((a, b) => {
    // Extract root note
    const rootA = a.symbol.match(/^([A-G][#b]?)/)?.[1] || '';
    const rootB = b.symbol.match(/^([A-G][#b]?)/)?.[1] || '';
    
    // Order: C, C#, Db, D, D#, Eb, E, F, F#, Gb, G, G#, Ab, A, A#, Bb, B
    const rootOrder = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
    const indexA = rootOrder.indexOf(rootA);
    const indexB = rootOrder.indexOf(rootB);
    
    if (indexA !== indexB) {
      return indexA - indexB;
    }
    
    // Same root, sort by type
    const typeOrder = ['', 'm', 'dim', 'aug', 'maj7', '7', 'm7', 'dim7', 'm(maj7)', 'm7b5', 'sus2', 'sus4', '6', '6/9', '9', '11', '13', '5'];
    const typeA = a.symbol.replace(/^[A-G][#b]?/, '');
    const typeB = b.symbol.replace(/^[A-G][#b]?/, '');
    return typeOrder.indexOf(typeA) - typeOrder.indexOf(typeB);
  });
  
  // Print summary
  const byRoot = {};
  uniqueChords.forEach(chord => {
    // Extract root note - match note name at the start
    const rootMatch = chord.symbol.match(/^([A-G][#b]?)/);
    if (rootMatch) {
      const root = rootMatch[1];
      if (!byRoot[root]) byRoot[root] = 0;
      byRoot[root]++;
    }
  });
  
  console.log(`\nUnique chords: ${uniqueChords.length}`);
  console.log('\nChords by root note:');
  Object.keys(byRoot).sort().forEach(root => {
    console.log(`  ${root}: ${byRoot[root]} chords`);
  });
  
  // Save to file
  const outputPath = path.join(__dirname, '../data/chords.json');
  fs.writeFileSync(outputPath, JSON.stringify(uniqueChords, null, 2), 'utf-8');
  console.log(`\nChords saved to: ${outputPath}`);
};

if (require.main === module) {
  main();
}

module.exports = { generateAllChords };

