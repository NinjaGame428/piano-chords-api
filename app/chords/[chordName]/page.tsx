'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PianoKeyboard } from '@/components/PianoKeyboard';
import type { Chord } from '@/types/chord';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations, translateNotes, translateChordName, translateChordSymbol, translateIntervals } from '@/lib/translations';

export default function ChordDetailPage() {
  const params = useParams();
  const chordName = decodeURIComponent(params.chordName as string);
  const [chord, setChord] = useState<Chord | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const loadChord = async () => {
      try {
        const response = await fetch('/api/chords');
        if (response.ok) {
          const chords = await response.json();
          const found = chords.find((c: Chord) => c.symbol === chordName);
          setChord(found || null);
        }
      } catch (error) {
        console.error('Error loading chord:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChord();
  }, [chordName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.common.loading}</div>
      </div>
    );
  }

  if (!chord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t.chords.chordNotFound}</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            {t.chords.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline mb-6 transition-colors"
        >
          <span className="mr-2">←</span> {t.chords.backToAllChords}
        </Link>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{translateChordSymbol(chord.symbol || '', language)}</h1>
            <h2 className="text-2xl text-gray-600 mb-4">{translateChordName(chord.symbol, chord.fullName, language)}</h2>
            {chord.description && (
              <p className="text-gray-700 mb-4">
                {language === 'fr' 
                  ? `L'accord ${translateChordName(chord.symbol, chord.fullName, language)} pour Piano a les notes ${translateNotes(chord.notes || [], language).join(' ')} et la structure d'intervalles ${translateIntervals(chord.intervals || [], language).join(' ')}.`
                  : chord.description
                }
              </p>
            )}
          </div>

          {/* Piano Keyboard */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">{t.chords.pianoKeyboard}</h3>
            <div className="flex justify-center">
              <PianoKeyboard 
                notes={translateNotes(chord.notes || [], language)}
                width={800}
                startOctave={2}
                endOctave={5}
              />
            </div>
          </div>

          {/* Chord Image */}
          {chord.imageLocal && (
            <div className="mb-6">
              <img
                src={chord.imageLocal}
                alt={`${chord.symbol} chord`}
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
                loading="lazy"
              />
            </div>
          )}

          {/* Notes and Intervals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{t.chords.notes}</h3>
              <div className="flex flex-wrap gap-2">
                {chord.notes && chord.notes.length > 0 ? (
                  translateNotes(chord.notes, language).map((note: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md font-medium"
                    >
                      {note}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">{t.common.nA}</span>
                )}
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{t.chords.intervals}</h3>
              <div className="flex flex-wrap gap-2">
                {chord.intervals && chord.intervals.length > 0 ? (
                  translateIntervals(chord.intervals, language).map((interval: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md font-medium"
                    >
                      {interval}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">{t.common.nA}</span>
                )}
              </div>
            </div>
          </div>

          {/* Alternate Symbols */}
          {chord.alternateSymbols && chord.alternateSymbols.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{t.chords.alternateSymbols}</h3>
              <div className="flex flex-wrap gap-2">
                {chord.alternateSymbols.map((alt: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Inversions */}
          {chord.inversions && chord.inversions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{t.chords.inversions}</h3>
              <div className="space-y-2">
                {chord.inversions.map((inv: { name: string; notes?: string[] }, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-3"
                  >
                    <div className="font-medium mb-1">{inv.name}</div>
                    {inv.notes && inv.notes.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {t.chords.notes}: {translateNotes(inv.notes, language).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Chords */}
          {chord.relatedChords && chord.relatedChords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{t.chords.relatedChords}</h3>
              <div className="flex flex-wrap gap-2">
                {chord.relatedChords.map((related: { name: string; url?: string | null }, index: number) => (
                  <Link
                    key={index}
                    href={`/chords/${encodeURIComponent(related.name)}`}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                  >
                    {related.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

