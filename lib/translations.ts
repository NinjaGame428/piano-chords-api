export type Language = 'en' | 'fr';

export const translations = {
  en: {
    // Navigation
    nav: {
      allChords: 'All Chords',
      scales: 'Scales',
    },
    // Home page
    home: {
      title: 'Piano Chords Database',
      subtitle: 'Explore and play piano chords with interactive audio',
      searchPlaceholder: 'Search chords by name, symbol, or notes...',
      filterAllRoots: 'All Roots',
      filterAllTypes: 'All Types',
      showing: 'Showing',
      of: 'of',
      chords: 'chords',
      clearFilters: 'Clear filters',
      noChordsFound: 'No chords found',
      noChordsMessage: 'Try adjusting your search or filters to find chords.',
      clearAllFilters: 'Clear all filters',
    },
    // Chords page
    chords: {
      backToAllChords: 'Back to All Chords',
      pianoKeyboard: 'Piano Keyboard',
      notes: 'Notes',
      intervals: 'Intervals',
      alternateSymbols: 'Symboles Alternatifs',
      inversions: 'Renversements',
      relatedChords: 'Accords Similaires',
      nA: 'N/A',
      chordNotFound: 'Chord not found',
      backToHome: 'Back to Home',
    },
    // Scales page
    scales: {
      title: 'Musical Scale Navigator',
      subtitle: 'Select the Key and the Scale Type you want',
      searchPlaceholder: 'Search scales by name, key, type, or notes...',
      filterAllKeys: 'All Keys',
      filterAllTypes: 'All Scale Types',
      showing: 'Showing',
      of: 'of',
      scales: 'scales',
      clearFilters: 'Clear filters',
      browseByKey: 'Browse Scales by Key',
      browseByType: 'Browse Scales by Type',
      noScalesFound: 'No scales found',
      noScalesMessage: 'Try adjusting your search or filters to find scales.',
      clearAllFilters: 'Clear all filters',
      backToScales: 'Back to Scales',
      pianoKeyboard: 'Piano Keyboard',
      notes: 'Notes',
      intervals: 'Intervals',
      key: 'Key',
      type: 'Type',
      scaleNotFound: 'Scale not found',
      learnTheChords: 'Learn the Chords',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      chordNotes: 'Chord Notes',
      nA: 'N/A',
    },
  },
  fr: {
    // Navigation
    nav: {
      allChords: 'Tous les Accords',
      scales: 'Gammes',
    },
    // Home page
    home: {
      title: 'Base de Données d\'Accords de Piano',
      subtitle: 'Explorez et jouez des accords de piano avec audio interactif',
      searchPlaceholder: 'Rechercher des accords par nom, symbole ou notes...',
      filterAllRoots: 'Toutes les Notes Fondamentales',
      filterAllTypes: 'Tous les Types',
      showing: 'Affichage de',
      of: 'sur',
      chords: 'accords',
      clearFilters: 'Effacer les filtres',
      noChordsFound: 'Aucun accord trouvé',
      noChordsMessage: 'Essayez d\'ajuster votre recherche ou vos filtres pour trouver des accords.',
      clearAllFilters: 'Effacer tous les filtres',
    },
    // Chords page
    chords: {
      backToAllChords: 'Retour à tous les accords',
      pianoKeyboard: 'Clavier de Piano',
      notes: 'Notes',
      intervals: 'Intervalles',
      alternateSymbols: 'Symboles Alternatifs',
      inversions: 'Renversements',
      relatedChords: 'Accords Similaires',
      chordNotFound: 'Accord non trouvé',
      backToHome: 'Retour à l\'Accueil',
    },
    // Scales page
    scales: {
      title: 'Navigateur de Gammes Musicales',
      subtitle: 'Sélectionnez la Note Fondamentale et le Type de Gamme',
      searchPlaceholder: 'Rechercher des gammes par nom, note fondamentale, type ou notes...',
      filterAllKeys: 'Toutes les Notes',
      filterAllTypes: 'Tous les Types de Gammes',
      showing: 'Affichage de',
      of: 'sur',
      scales: 'gammes',
      clearFilters: 'Effacer les filtres',
      browseByKey: 'Parcourir par Note Fondamentale',
      browseByType: 'Parcourir par Type',
      noScalesFound: 'Aucune gamme trouvée',
      noScalesMessage: 'Essayez d\'ajuster votre recherche ou vos filtres pour trouver des gammes.',
      clearAllFilters: 'Effacer tous les filtres',
      backToScales: 'Retour aux Gammes',
      pianoKeyboard: 'Clavier de Piano',
      notes: 'Notes',
      intervals: 'Intervalles',
      key: 'Clé',
      type: 'Type',
      scaleNotFound: 'Gamme non trouvée',
      learnTheChords: 'Apprendre les Accords',
      nA: 'N/A',
    },
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      chordNotes: 'Notes d\'Accord',
      nA: 'N/A',
    },
  },
};

// Note name mappings
const noteMappings = {
  en: {
    'C': 'C', 'C#': 'C#', 'Db': 'Db',
    'D': 'D', 'D#': 'D#', 'Eb': 'Eb',
    'E': 'E',
    'F': 'F', 'F#': 'F#', 'Gb': 'Gb',
    'G': 'G', 'G#': 'G#', 'Ab': 'Ab',
    'A': 'A', 'A#': 'A#', 'Bb': 'Bb',
    'B': 'B',
  },
  fr: {
    'C': 'Do', 'C#': 'Do#', 'Db': 'Réb',
    'D': 'Ré', 'D#': 'Ré#', 'Eb': 'Mib',
    'E': 'Mi',
    'F': 'Fa', 'F#': 'Fa#', 'Gb': 'Solb',
    'G': 'Sol', 'G#': 'Sol#', 'Ab': 'Lab',
    'A': 'La', 'A#': 'La#', 'Bb': 'Sib',
    'B': 'Si',
  },
};

// Convert note name based on language
export function translateNote(note: string, lang: Language): string {
  if (lang === 'en') return note;
  
  const cleanNote = note.replace(/[0-9]/g, '').trim();
  const octaveMatch = note.match(/([0-9])/);
  const octave = octaveMatch ? octaveMatch[1] : '';
  
  // Map English notes to French solfège
  const mapping = noteMappings.fr[cleanNote as keyof typeof noteMappings.fr];
  if (mapping) {
    return octave ? `${mapping}${octave}` : mapping;
  }
  
  // If already in French, return as is
  return note;
}

// Convert multiple notes
export function translateNotes(notes: string[], lang: Language): string[] {
  return notes.map(note => translateNote(note, lang));
}

// Reverse translation: French solfège back to English (for filtering)
export function reverseTranslateNote(note: string, lang: Language): string {
  if (lang === 'en') return note;
  
  const reverseMapping: Record<string, string> = {
    'Do': 'C', 'Do#': 'C#', 'Réb': 'Db', 'Ré': 'D', 'Dé': 'D', 'Ré#': 'D#', 
    'Mib': 'Eb', 'Mi': 'E',
    'Fa': 'F', 'Fa#': 'F#', 'Solb': 'Gb', 'Sol': 'G', 'Sol#': 'G#',
    'Lab': 'Ab', 'La': 'A', 'La#': 'A#', 'Sib': 'Bb', 'Si': 'B',
  };
  
  const cleanNote = note.replace(/[0-9]/g, '').trim();
  const octaveMatch = note.match(/([0-9])/);
  const octave = octaveMatch ? octaveMatch[1] : '';
  
  const original = reverseMapping[cleanNote] || cleanNote;
  return octave ? `${original}${octave}` : original;
}

// Get chord type translations
function getChordTypeTranslation(chordType: string, lang: Language): string {
  if (lang === 'en') return chordType;
  
  const typeTranslations: Record<string, string> = {
    '': 'majeur',
    'm': 'mineur',
    'dim': 'diminué',
    'aug': 'augmenté',
    'maj7': 'majeur septième',
    '7': 'septième',
    'm7': 'mineur septième',
    'dim7': 'diminué septième',
    'm(maj7)': 'mineur majeur septième',
    'm7b5': 'mineur septième bémol cinq',
    'sus2': 'suspendu seconde',
    'sus4': 'suspendu quarte',
    '6': 'sixième',
    '6/9': 'sixième neuvième',
    '9': 'neuvième',
    '11': 'onzième',
    '13': 'treizième',
    '5': 'cinquième',
  };
  
  return typeTranslations[chordType] || chordType;
}

// Translate chord symbol (e.g., "Cdim" -> "Dodim" -> "Do diminué")
export function translateChordSymbol(chordSymbol: string, lang: Language): string {
  if (lang === 'en') return chordSymbol;
  
  // Get the root note from the symbol
  const rootMatch = chordSymbol.match(/^([A-G][#b]?)/);
  if (!rootMatch) return chordSymbol;
  
  const rootNote = rootMatch[1];
  const translatedRoot = translateNote(rootNote, lang);
  const chordType = chordSymbol.substring(rootNote.length);
  const translatedType = getChordTypeTranslation(chordType, lang);
  
  // Return translated symbol: root + type abbreviation or full type
  // For display, we can show "Do dim" or "Do diminué"
  // Let's show the abbreviated type in the symbol
  return `${translatedRoot}${chordType}`;
}

// Translate chord names (e.g., "C major" -> "Do majeur")
export function translateChordName(chordSymbol: string, fullName: string | undefined, lang: Language): string {
  if (lang === 'en') return fullName || chordSymbol;
  
  // Get the root note from the symbol
  const rootMatch = chordSymbol.match(/^([A-G][#b]?)/);
  if (!rootMatch) return fullName || chordSymbol;
  
  const rootNote = rootMatch[1];
  const translatedRoot = translateNote(rootNote, lang);
  const chordType = chordSymbol.substring(rootNote.length);
  const translatedType = getChordTypeTranslation(chordType, lang);
  
  return `${translatedRoot} ${translatedType}`;
}

// Translate scale types
function getScaleTypeTranslation(scaleType: string, lang: Language): string {
  if (lang === 'en') return scaleType;
  
  const typeTranslations: Record<string, string> = {
    'major': 'majeur',
    'natural minor': 'mineur naturel',
    'harmonic minor': 'mineur harmonique',
    'melodic minor': 'mineur mélodique',
    'minor pentatonic': 'pentatonique mineur',
    'major pentatonic': 'pentatonique majeur',
    'blues': 'blues',
    'major blues': 'blues majeur',
    'pentatonic blues': 'blues pentatonique',
    'whole tone': 'ton entier',
    'augmented': 'augmenté',
    'diminished (halftone - wholetone)': 'diminué (demi-ton - ton entier)',
    'diminished (wholetone - halftone)': 'diminué (ton entier - demi-ton)',
    'ionian': 'ionien',
    'dorian': 'dorien',
    'phrygian': 'phrygien',
    'lydian': 'lydien',
    'mixolydian': 'mixolydien',
    'aeolian': 'éolien',
    'locrian': 'locrien',
    'diatonic': 'diatonique',
    'dominant pentatonic': 'pentatonique dominant',
    'pentatonic neutral': 'pentatonique neutre',
    'altered': 'altéré',
    'bebop major': 'bebop majeur',
    'bebop minor': 'bebop mineur',
    'bebop dominant': 'bebop dominant',
    'bebop half diminished': 'bebop demi-diminué',
  };
  
  return typeTranslations[scaleType.toLowerCase()] || scaleType;
}

// Translate scale names (e.g., "C Harmonic Minor" -> "Do Mineur Harmonique")
export function translateScaleName(scaleName: string, scaleKey: string, scaleType: string, lang: Language): string {
  if (lang === 'en') return scaleName;
  
  const translatedKey = translateNote(scaleKey, lang);
  const translatedType = getScaleTypeTranslation(scaleType, lang);
  
  // Capitalize first letter
  const capitalizedType = translatedType.charAt(0).toUpperCase() + translatedType.slice(1);
  return `${translatedKey} ${capitalizedType}`;
}

// Translate scale type only
export function translateScaleType(scaleType: string, lang: Language): string {
  return getScaleTypeTranslation(scaleType, lang);
}

// Translate scale descriptions
export function translateScaleDescription(description: string | undefined, scaleKey: string, scaleType: string, scaleNotes: string[], lang: Language): string {
  if (lang === 'en' || !description) return description || '';
  
  const translatedKey = translateNote(scaleKey, lang);
  const translatedNotes = translateNotes(scaleNotes, lang);
  
  const translatedType = getScaleTypeTranslation(scaleType, lang);
  
  // Build French description
  const notesList = translatedNotes.join(', ');
  return `La gamme ${translatedKey} ${translatedType} a les notes ${notesList}.`;
}

// Translate interval notation (e.g., "b3" -> "b3", "#5" -> "♯5")
export function translateInterval(interval: string, lang: Language): string {
  if (lang === 'en') return interval;
  
  // Replace # with ♯ for better display in French
  // Keep b as is (standard notation)
  // Replace # with "dièse" in text form if needed, but ♯ is more universal
  return interval.replace(/#/g, '♯');
}

// Translate multiple intervals
export function translateIntervals(intervals: string[], lang: Language): string[] {
  return intervals.map(interval => translateInterval(interval, lang));
}

// Translate chord types for filter dropdown (e.g., "major" -> "majeur", "minor" -> "mineur")
export function translateChordType(type: string, lang: Language): string {
  if (lang === 'en') return type;
  
  const typeTranslations: Record<string, string> = {
    'major': 'majeur',
    'minor': 'mineur',
    '7th': 'septième',
    '9th': 'neuvième',
    '6th': 'sixième',
    'augmented': 'augmenté',
    'diminished': 'diminué',
  };
  
  return typeTranslations[type.toLowerCase()] || type;
}

