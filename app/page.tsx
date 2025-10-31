'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { Chord } from '@/types/chord';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations, translateNotes, reverseTranslateNote, translateChordName, translateChordSymbol, translateIntervals, translateChordType } from '@/lib/translations';

export default function Home() {
  const [chords, setChords] = useState<Chord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRoot, setFilterRoot] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const loadChords = async () => {
      try {
        const response = await fetch('/api/chords');
        if (response.ok) {
          const data = await response.json();
          setChords(data);
        } else {
          console.error('Failed to load chords');
        }
      } catch (error) {
        console.error('Error loading chords:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChords();
  }, []);

  // Get unique root notes and types for filters
  const rootNotes = useMemo(() => {
    const roots = new Set<string>();
    chords.forEach((chord) => {
      if (chord.notes && chord.notes.length > 0) {
        // Get the root note (first note, without # or b)
        const root = chord.notes[0].replace(/[#b]/, '');
        roots.add(root);
      }
    });
    return Array.from(roots).sort();
  }, [chords]);

  const chordTypes = useMemo(() => {
    const types = new Set<string>();
    chords.forEach((chord) => {
      const symbol = chord.symbol || '';
      if (symbol.includes('m')) types.add('minor');
      if (symbol.includes('7')) types.add('7th');
      if (symbol.includes('9')) types.add('9th');
      if (symbol.includes('6')) types.add('6th');
      if (symbol.includes('aug')) types.add('augmented');
      if (symbol.includes('dim')) types.add('diminished');
      if (!symbol.includes('m') && !symbol.match(/[0-9]/) && !symbol.includes('aug') && !symbol.includes('dim')) {
        types.add('major');
      }
    });
    return Array.from(types).sort();
  }, [chords]);

  // Filter chords
  const filteredChords = useMemo(() => {
    return chords.filter((chord) => {
      // Search filter
      const matchesSearch = 
        !searchQuery ||
        chord.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chord.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chord.notes?.some((note) => note.toLowerCase().includes(searchQuery.toLowerCase()));

      // Root note filter - extract from chord symbol, not notes array
      // This avoids issues with enharmonic equivalents (e.g., G# vs Ab)
      const rootMatch = chord.symbol?.match(/^([A-G][#b]?)/);
      const rootNote = rootMatch ? rootMatch[1].replace(/[#b]/, '') : '';
      // filterRoot is always in English (from option value), so compare directly
      const matchesRoot = filterRoot === 'all' || rootNote === filterRoot;

      // Type filter
      const symbol = chord.symbol?.toLowerCase() || '';
      let matchesType = filterType === 'all';
      if (filterType === 'major') {
        matchesType = !symbol.includes('m') && !symbol.match(/[0-9]/) && !symbol.includes('aug') && !symbol.includes('dim');
      } else if (filterType === 'minor') {
        matchesType = symbol.includes('m') && !symbol.match(/m[0-9]/);
      } else if (filterType === '7th') {
        matchesType = symbol.includes('7');
      } else if (filterType === '9th') {
        matchesType = symbol.includes('9');
      } else if (filterType === '6th') {
        matchesType = symbol.includes('6');
      } else if (filterType === 'augmented') {
        matchesType = symbol.includes('aug');
      } else if (filterType === 'diminished') {
        matchesType = symbol.includes('dim');
      }

      return matchesSearch && matchesRoot && matchesType;
    });
  }, [chords, searchQuery, filterRoot, filterType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎹</div>
          <div className="text-xl font-semibold text-gray-700">{t.common.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">{t.home.title}</h1>
          <p className="text-center text-gray-600">{t.home.subtitle}</p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={t.home.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            <select
              value={filterRoot}
              onChange={(e) => setFilterRoot(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">{t.home.filterAllRoots}</option>
              {rootNotes.map((root) => {
                // Display translated note but keep English value for filtering
                const displayNote = translateNotes([root], language)[0];
                return (
                  <option key={root} value={root}>
                    {displayNote}
                  </option>
                );
              })}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                      <option value="all">{t.home.filterAllTypes}</option>
              {chordTypes.map((type) => {
                // Display translated type but keep English value for filtering
                const displayType = translateChordType(type, language);
                return (
                  <option key={type} value={type}>
                    {displayType}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {t.home.showing} <span className="font-semibold text-blue-600">{filteredChords.length}</span> {t.home.of}{' '}
                      <span className="font-semibold">{chords.length}</span> {t.home.chords}
                    </span>
                    {(searchQuery || filterRoot !== 'all' || filterType !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterRoot('all');
                          setFilterType('all');
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {t.home.clearFilters}
                      </button>
                    )}
          </div>
        </div>

        {/* Chords Grid */}
        {filteredChords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredChords.map((chord) => (
              <div
                key={chord.symbol}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-xl transition-all duration-200 hover:border-blue-300"
              >
                <div className="mb-3">
                  <Link
                    href={`/chords/${encodeURIComponent(chord.symbol || '')}`}
                    className="text-2xl font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {translateChordSymbol(chord.symbol || '', language)}
                  </Link>
                </div>
                <div className="text-sm text-gray-700 mb-3 font-medium">
                  {translateChordName(chord.symbol || '', chord.fullName, language)}
                </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {chord.notes?.map((note, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                            >
                              {translateNotes([note], language)[0]}
                            </span>
                          ))}
                        </div>
                {chord.intervals && chord.intervals.length > 0 && (
                  <div className="text-xs text-gray-500 mb-3">
                    {t.chords.intervals}: <span className="font-medium">{translateIntervals(chord.intervals, language).join(', ')}</span>
                  </div>
                )}
                {chord.imageLocal && (
                  <div className="mt-3">
                    <img
                      src={chord.imageLocal}
                      alt={chord.symbol}
                      className="w-full h-auto rounded border border-gray-200"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <div className="text-6xl mb-4">🎹</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.home.noChordsFound}</h3>
                    <p className="text-gray-600 mb-4">
                      {t.home.noChordsMessage}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterRoot('all');
                        setFilterType('all');
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t.home.clearAllFilters}
                    </button>
                  </div>
        )}

      </div>
    </div>
  );
}

