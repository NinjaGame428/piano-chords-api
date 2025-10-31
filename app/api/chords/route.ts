import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const CHORDS_FILE = path.join(process.cwd(), 'data', 'chords.json');
    
    if (!fs.existsSync(CHORDS_FILE)) {
      console.warn(`Chords file not found at: ${CHORDS_FILE}`);
      return NextResponse.json(
        { error: 'Chords data not found. Please run the scraper first.' },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(CHORDS_FILE, 'utf-8');
    
    if (!fileContents || fileContents.trim().length === 0) {
      console.error('Chords file is empty');
      return NextResponse.json(
        { error: 'Chords file is empty' },
        { status: 500 }
      );
    }

    const chords = JSON.parse(fileContents);

    if (!Array.isArray(chords)) {
      console.error('Chords data is not an array');
      return NextResponse.json(
        { error: 'Invalid chords data format' },
        { status: 500 }
      );
    }

    return NextResponse.json(chords);
  } catch (error: any) {
    console.error('Error reading chords file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load chords',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

