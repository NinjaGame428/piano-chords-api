'use client';

import { useState, useRef, useEffect } from 'react';

// Dynamic import to prevent SSR issues with Tone.js
let Tone: any = null;

// MIDI note numbers for each note in octave 4
const NOTE_TO_MIDI: Record<string, number> = {
  'C': 60,
  'C#': 61, 'Db': 61,
  'D': 62,
  'D#': 63, 'Eb': 63,
  'E': 64,
  'F': 65,
  'F#': 66, 'Gb': 66,
  'G': 67,
  'G#': 68, 'Ab': 68,
  'A': 69,
  'A#': 70, 'Bb': 70,
  'B': 71,
};

// Convert note name to MIDI number (defaulting to octave 4)
const noteToMidi = (note: string): number => {
  // Remove octave if present
  const cleanNote = note.replace(/[0-9]/g, '');
  // Get base MIDI number
  const baseMidi = NOTE_TO_MIDI[cleanNote] || 60;
  // Check if octave is specified
  const octaveMatch = note.match(/([0-9])/);
  if (octaveMatch) {
    const octave = parseInt(octaveMatch[1]);
    return baseMidi + (octave - 4) * 12;
  }
  return baseMidi;
};

interface PlayChordButtonProps {
  notes: string[];
  chordName: string;
  size?: 'small' | 'medium' | 'large';
}

export const PlayChordButton: React.FC<PlayChordButtonProps> = ({
  notes,
  chordName,
  size = 'medium',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const synthRef = useRef<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize Tone.js
    const initTone = async () => {
      try {
        // Dynamically import Tone.js only on client
        const toneModule = await import('tone');
        
        // Tone.js v14 exports all classes as named exports
        // Use the module directly
        Tone = toneModule;

        // Check if required classes are available
        if (!toneModule.PolySynth || !toneModule.Synth) {
          console.warn('Tone.js PolySynth or Synth not found - audio disabled');
          setIsInitialized(true);
          return;
        }

        // Get context - Tone.js exports it as getContext() or context property
        const getContext = toneModule.getContext || (() => toneModule.context);
        const context = getContext ? getContext() : (toneModule.context || null);
        
        // Start audio context if needed
        const start = toneModule.start || (async () => {});
        if (context && context.state !== 'running') {
          try {
            await start();
          } catch (e) {
            // Audio context might require user interaction
            console.warn('Could not start audio context:', e);
          }
        }

        // Create synth using named exports
        synthRef.current = new toneModule.PolySynth(toneModule.Synth, {
          oscillator: {
            type: 'sine',
          },
          envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.5,
            release: 0.8,
          },
        }).toDestination();

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Tone.js:', error);
        setIsInitialized(true); // Set to true anyway so UI doesn't break
      }
    };

    initTone();

    return () => {
      if (synthRef.current) {
        try {
          synthRef.current.dispose();
        } catch (error) {
          console.error('Error disposing synth:', error);
        }
      }
    };
  }, []);

  const handlePlay = async () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isInitialized || !synthRef.current || notes.length === 0) {
      return;
    }

    try {
      // Ensure Tone.js is loaded
      if (!Tone || !Tone.PolySynth) {
        const toneModule = await import('tone');
        Tone = toneModule;
        
        if (!Tone.PolySynth || !Tone.Synth) {
          console.error('Tone.js classes not available');
          return;
        }
      }

      // Get context and ensure it's running
      const getContext = Tone.getContext || (() => Tone.context);
      const context = getContext ? getContext() : (Tone.context || null);
      
      if (!context) {
        console.error('Tone.js context not available');
        return;
      }

      // Start audio context if needed
      const start = Tone.start || (async () => {});
      if (context.state !== 'running') {
        try {
          await start();
        } catch (e) {
          console.warn('Could not start audio context:', e);
        }
      }

      setIsPlaying(true);

      // Convert notes to frequencies
      const frequencies = notes
        .map((note) => {
          try {
            const midi = noteToMidi(note);
            // Convert MIDI to frequency: frequency = 440 * 2^((midi - 69) / 12)
            const frequency = 440 * Math.pow(2, (midi - 69) / 12);
            return frequency;
          } catch (error) {
            console.error(`Failed to convert note ${note}:`, error);
            return null;
          }
        })
        .filter((freq): freq is number => freq !== null);

      if (frequencies.length === 0) {
        setIsPlaying(false);
        return;
      }

      // Play chord
      if (synthRef.current && Tone.PolySynth) {
        synthRef.current.triggerAttackRelease(
          frequencies,
          '1.5s'
        );

        // Reset playing state after duration
        setTimeout(() => {
          setIsPlaying(false);
        }, 1500);
      } else {
        console.error('Synth not available');
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing chord:', error);
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={handlePlay}
      disabled={!isInitialized || notes.length === 0 || isPlaying}
      className={`
        ${sizeClasses[size]}
        bg-blue-600 text-white rounded-lg
        hover:bg-blue-700 active:bg-blue-800
        disabled:bg-gray-400 disabled:cursor-not-allowed
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-label={`Play ${chordName} chord`}
      title={`Play ${chordName} chord`}
    >
      {isPlaying ? 'Playing...' : '▶ Play'}
    </button>
  );
};

