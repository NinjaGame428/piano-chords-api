'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translateNote } from '@/lib/translations';

interface PianoKeyboardProps {
  notes: string[];
  width?: number;
  startOctave?: number;
  endOctave?: number;
}

// MIDI note numbers mapping
const NOTE_TO_MIDI: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11,
};

// Convert note name to MIDI note number (relative to C)
const noteToMidiOffset = (note: string): number => {
  const cleanNote = note.replace(/[0-9]/g, '').trim();
  return NOTE_TO_MIDI[cleanNote] ?? 0;
};

// Check if note is a black key (sharp/flat)
const isBlackKey = (note: string): boolean => {
  const cleanNote = note.replace(/[0-9]/g, '').trim();
  return cleanNote.includes('#') || cleanNote.includes('b');
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  notes = [],
  width = 800,
  startOctave = 2,
  endOctave = 5,
}) => {
  const { language } = useLanguage();
  
  // Convert note names to their original English names for MIDI calculation
  // First, translate from French solfège back to English if needed
  const getOriginalNote = (note: string): string => {
    // Reverse mapping: French solfège to English
    const reverseMapping: Record<string, string> = {
      'Do': 'C', 'Do#': 'C#', 'Ré': 'D', 'Dé': 'D', 'Ré#': 'D#', 'Mi': 'E',
      'Fa': 'F', 'Fa#': 'F#', 'Sol': 'G', 'Sol#': 'G#', 'La': 'A', 'La#': 'A#', 'Si': 'B',
      'Réb': 'Db', 'Mib': 'Eb', 'Solb': 'Gb', 'Lab': 'Ab', 'Sib': 'Bb',
    };
    
    const cleanNote = note.replace(/[0-9]/g, '').trim();
    const octave = note.match(/(\d)/)?.[1] || '';
    const original = reverseMapping[cleanNote] || cleanNote;
    return original + octave;
  };

  // Convert chord notes to MIDI note numbers (C4 = 60)
  // MIDI formula: (octave + 1) * 12 + semitone_offset
  const highlightedMidiNotes = notes.map(note => {
    // Get original English note for calculation
    const originalNote = getOriginalNote(note);
    const cleanNote = originalNote.replace(/[0-9]/g, '').trim();
    const semitoneOffset = NOTE_TO_MIDI[cleanNote] ?? 0;
    
    // Extract octave if present (default to octave 4)
    const octaveMatch = originalNote.match(/(\d)/);
    const octave = octaveMatch ? parseInt(octaveMatch[1]) : 4;
    
    // MIDI note = (octave + 1) * 12 + semitone_offset
    // C4 = (4 + 1) * 12 + 0 = 60
    return (octave + 1) * 12 + semitoneOffset;
  });

  // Generate all keys for the specified range
  interface KeyInfo {
    name: string;
    midiNote: number;
    octave: number;
    isBlack: boolean;
  }
  
  const keys: KeyInfo[] = [];
  for (let octave = startOctave; octave <= endOctave; octave++) {
    const octaveKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    octaveKeys.forEach(key => {
      const semitoneOffset = NOTE_TO_MIDI[key] ?? 0;
      const midiNote = (octave + 1) * 12 + semitoneOffset;
      keys.push({
        name: key,
        midiNote,
        octave,
        isBlack: key.includes('#'),
      });
    });
  }

  // Calculate key dimensions
  const whiteKeys = keys.filter(k => !k.isBlack);
  const blackKeys = keys.filter(k => k.isBlack);
  const whiteKeyWidth = width / whiteKeys.length;
  const whiteKeyHeight = whiteKeyWidth * 5;
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const blackKeyHeight = whiteKeyHeight * 0.6;

  // Check if a key should be highlighted
  const isHighlighted = (midiNote: number): boolean => {
    return highlightedMidiNotes.includes(midiNote);
  };

  // Get note name for display (with translation)
  const getNoteName = (key: KeyInfo): string => {
    const translated = translateNote(key.name, language);
    if (key.name.includes('#')) {
      return translated;
    }
    return `${translated}${key.octave}`;
  };

  // Position black keys relative to white keys
  const getBlackKeyPosition = (key: { name: string; octave: number }): number => {
    // Find the white key in the same octave that precedes this black key
    const whiteKeyNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    let precedingWhiteKey = '';
    
    if (key.name === 'C#' || key.name === 'Db') {
      precedingWhiteKey = 'C';
    } else if (key.name === 'D#' || key.name === 'Eb') {
      precedingWhiteKey = 'D';
    } else if (key.name === 'F#' || key.name === 'Gb') {
      precedingWhiteKey = 'F';
    } else if (key.name === 'G#' || key.name === 'Ab') {
      precedingWhiteKey = 'G';
    } else if (key.name === 'A#' || key.name === 'Bb') {
      precedingWhiteKey = 'A';
    }
    
    // Find the index of this white key in the same octave
    const whiteKeyIndex = whiteKeys.findIndex(k => 
      k.name === precedingWhiteKey && k.octave === key.octave
    );
    
    if (whiteKeyIndex >= 0) {
      return whiteKeyIndex * whiteKeyWidth + whiteKeyWidth * 0.65;
    }
    return 0;
  };

  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="relative mx-auto" style={{ width: `${width}px`, height: `${whiteKeyHeight}px` }}>
        {/* White Keys */}
        <div className="relative">
          {whiteKeys.map((key, index) => {
            const midiNote = key.midiNote;
            const highlighted = isHighlighted(midiNote);
            
            return (
              <div
                key={`white-${midiNote}`}
                className="absolute border border-gray-400 rounded-b-lg cursor-pointer transition-all duration-200"
                  style={{
                  left: `${index * whiteKeyWidth}px`,
                  width: `${whiteKeyWidth - 2}px`,
                  height: `${whiteKeyHeight}px`,
                  backgroundColor: highlighted ? '#3B82F6' : '#FFFFFF',
                  color: highlighted ? '#FFFFFF' : '#000000',
                  zIndex: 1,
                  boxShadow: highlighted 
                    ? 'inset 0 0 15px rgba(37, 99, 235, 0.7), 0 3px 6px rgba(0,0,0,0.3)' 
                    : 'inset 0 -5px 10px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)',
                  borderColor: highlighted ? '#2563EB' : '#9CA3AF',
                  borderWidth: highlighted ? '2px' : '1px',
                }}
                title={getNoteName(key)}
              >
              {highlighted && (
                <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-bold">
                  {translateNote(key.name, language)}
                </div>
              )}
              </div>
            );
          })}
        </div>

        {/* Black Keys */}
        <div className="relative">
          {blackKeys.map(key => {
            const midiNote = key.midiNote;
            const highlighted = isHighlighted(midiNote);
            const position = getBlackKeyPosition(key);
            
            return (
              <div
                key={`black-${midiNote}`}
                className="absolute rounded-b-lg cursor-pointer transition-all duration-200"
                  style={{
                  left: `${position}px`,
                  width: `${blackKeyWidth}px`,
                  height: `${blackKeyHeight}px`,
                  backgroundColor: highlighted ? '#1D4ED8' : '#1F2937',
                  color: '#FFFFFF',
                  zIndex: 2,
                  boxShadow: highlighted 
                    ? 'inset 0 0 15px rgba(29, 78, 216, 0.9), 0 3px 6px rgba(0,0,0,0.5)' 
                    : 'inset 0 -5px 10px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)',
                  borderColor: highlighted ? '#1E40AF' : '#374151',
                  borderWidth: highlighted ? '2px' : '1px',
                }}
                title={getNoteName(key)}
              >
                {highlighted && (
                  <div className="absolute bottom-1 left-0 right-0 text-center text-[10px] font-bold">
                    {translateNote(key.name, language).replace('#', '♯').replace('b', '♭')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <div className="inline-flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span>{language === 'fr' ? 'Notes d\'Accord' : 'Chord Notes'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

