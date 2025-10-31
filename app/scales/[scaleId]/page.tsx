'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PianoKeyboard } from '@/components/PianoKeyboard';
import type { Scale } from '@/types/scale';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations, translateNotes, translateScaleName, translateScaleDescription, translateScaleType, translateIntervals } from '@/lib/translations';

export default function ScaleDetailPage() {
  const params = useParams();
  const scaleId = params.scaleId as string;
  const [scale, setScale] = useState<Scale | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const loadScale = async () => {
      try {
        const response = await fetch('/api/scales');
        if (response.ok) {
          const scales = await response.json();
          const found = scales.find((s: Scale) => s.id === scaleId);
          setScale(found || null);
        }
      } catch (error) {
        console.error('Error loading scale:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScale();
  }, [scaleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t.common.loading}</div>
      </div>
    );
  }

  if (!scale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t.scales.scaleNotFound}</h1>
          <Link href="/scales" className="text-blue-600 hover:underline">
            {t.scales.backToScales}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/scales"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline mb-6 transition-colors"
        >
          <span className="mr-2">←</span> {t.scales.backToScales}
        </Link>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 border border-gray-200">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{translateScaleName(scale.name, scale.key, scale.type, language)}</h1>
            <div className="flex gap-4 text-gray-600">
              <p>{t.scales.key}: <span className="font-semibold text-gray-900">{translateNotes([scale.key], language)[0]}</span></p>
              <p>{t.scales.type}: <span className="font-semibold text-gray-900">{translateScaleType(scale.type, language)}</span></p>
            </div>
            <p className="text-gray-700 mt-4">
              {translateScaleDescription(scale.description, scale.key, scale.type, scale.notes || [], language)}
            </p>
          </div>

          {/* Piano Keyboard */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">{t.scales.pianoKeyboard}</h3>
            <div className="flex justify-center">
              <PianoKeyboard 
                notes={translateNotes(scale.notes || [], language)}
                width={800}
                startOctave={2}
                endOctave={5}
              />
            </div>
          </div>

          {/* Notes and Intervals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{t.scales.notes}</h3>
              <div className="flex flex-wrap gap-2">
                {scale.notes && scale.notes.length > 0 ? (
                  translateNotes(scale.notes, language).map((note: string, index: number) => (
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
              <h3 className="text-lg font-semibold mb-2">{t.scales.intervals}</h3>
              <div className="flex flex-wrap gap-2">
                {scale.intervals && scale.intervals.length > 0 ? (
                  translateIntervals(scale.intervals, language).map((interval: string, index: number) => (
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
        </div>
      </div>
    </div>
  );
}

