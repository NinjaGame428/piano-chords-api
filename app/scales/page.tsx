'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { Scale } from '@/types/scale';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations, translateNotes, reverseTranslateNote, translateScaleName, translateScaleType, translateScaleDescription } from '@/lib/translations';

export default function ScalesPage() {
  const [scales, setScales] = useState<Scale[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const loadScales = async () => {
      try {
        let url = '/api/scales';
        const params = new URLSearchParams();
        if (selectedKey !== 'all') {
          // Convert French note back to English for API
          const keyForApi = language === 'fr' 
            ? reverseTranslateNote(selectedKey.replace(/[#b]/, ''), language) || selectedKey
            : selectedKey;
          params.append('key', keyForApi);
        }
        if (selectedType !== 'all') params.append('type', selectedType);
        if (params.toString()) url += '?' + params.toString();

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setScales(data);
        }
      } catch (error) {
        console.error('Error loading scales:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScales();
  }, [selectedKey, selectedType]);

  // Get unique keys and types
  const allScales = useMemo(() => scales, [scales]);
  
  const keys = useMemo(() => {
    const uniqueKeys = new Set<string>();
    allScales.forEach((scale) => {
      if (scale.key) uniqueKeys.add(scale.key);
    });
    return Array.from(uniqueKeys).sort();
  }, [allScales]);

  const types = useMemo(() => {
    const uniqueTypes = new Set<string>();
    allScales.forEach((scale) => {
      if (scale.type) uniqueTypes.add(scale.type);
    });
    return Array.from(uniqueTypes).sort();
  }, [allScales]);

  // Filter scales by search query
  const filteredScales = useMemo(() => {
    return scales.filter((scale) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        scale.name?.toLowerCase().includes(query) ||
        scale.key?.toLowerCase().includes(query) ||
        scale.type?.toLowerCase().includes(query) ||
        scale.notes?.some((note) => note.toLowerCase().includes(query))
      );
    });
  }, [scales, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎵</div>
          <div className="text-xl font-semibold text-gray-700">{t.common.loading}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">{t.scales.title}</h1>
          <p className="text-center text-gray-600">{t.scales.subtitle}</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder={t.scales.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">{t.scales.filterAllKeys}</option>
              {keys.map((key) => {
                // Display translated note but keep English value for API
                const displayNote = translateNotes([key], language)[0];
                return (
                  <option key={key} value={key}>
                    {displayNote}
                  </option>
                );
              })}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">{t.scales.filterAllTypes}</option>
              {types.map((type) => {
                // Display translated type but keep English value for API
                const displayType = translateScaleType(type, language);
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
              {t.scales.showing} <span className="font-semibold text-blue-600">{filteredScales.length}</span> {t.scales.of}{' '}
              <span className="font-semibold">{scales.length}</span> {t.scales.scales}
            </span>
            {(searchQuery || selectedKey !== 'all' || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedKey('all');
                  setSelectedType('all');
                }}
                className="text-blue-600 hover:underline"
              >
                {t.scales.clearFilters}
              </button>
            )}
          </div>
        </div>

        {/* Quick Browse by Key */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t.scales.browseByKey}</h2>
          <div className="flex flex-wrap gap-2">
            {keys.map((key) => {
              const displayNote = translateNotes([key], language)[0];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedKey === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {displayNote}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Browse by Type */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t.scales.browseByType}</h2>
          <div className="flex flex-wrap gap-2">
            {types.slice(0, 20).map((type) => {
              const displayType = translateScaleType(type, language);
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    selectedType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {displayType}
                </button>
              );
            })}
            {types.length > 20 && (
              <span className="px-3 py-1 text-sm text-gray-500">
                {language === 'fr' 
                  ? `+${types.length - 20} types supplémentaires (utilisez le filtre ci-dessus)`
                  : `+${types.length - 20} more types (use filter above)`}
              </span>
            )}
          </div>
        </div>

        {/* Scales Grid */}
        {filteredScales.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredScales.map((scale) => (
              <Link
                key={scale.id}
                href={`/scales/${scale.id}`}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-xl transition-all duration-200 hover:border-blue-300"
              >
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-blue-600 mb-1">{translateScaleName(scale.name, scale.key, scale.type, language)}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {t.scales.key}: <span className="font-semibold">{translateNotes([scale.key], language)[0]}</span> | {t.scales.type}: <span className="font-semibold">{translateScaleType(scale.type, language)}</span>
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">{t.scales.notes}:</p>
                  <div className="flex flex-wrap gap-1">
                      {translateNotes(scale.notes?.slice(0, 7) || [], language).map((note, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                        >
                          {note}
                        </span>
                      ))}
                    {scale.notes && scale.notes.length > 7 && (
                      <span className="text-xs text-gray-500">+{scale.notes.length - 7}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.scales.noScalesFound}</h3>
            <p className="text-gray-600 mb-4">
              {t.scales.noScalesMessage}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedKey('all');
                setSelectedType('all');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.scales.clearAllFilters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

