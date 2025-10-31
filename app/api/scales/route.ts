import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const SCALES_FILE = path.join(process.cwd(), 'data', 'scales.json');
    
    if (!fs.existsSync(SCALES_FILE)) {
      console.warn(`Scales file not found at: ${SCALES_FILE}`);
      return NextResponse.json(
        { error: 'Scales data not found. Please run the generator first.' },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(SCALES_FILE, 'utf-8');
    
    if (!fileContents || fileContents.trim().length === 0) {
      console.error('Scales file is empty');
      return NextResponse.json(
        { error: 'Scales file is empty' },
        { status: 500 }
      );
    }

    const scales = JSON.parse(fileContents);

    if (!Array.isArray(scales)) {
      console.error('Scales data is not an array');
      return NextResponse.json(
        { error: 'Invalid scales data format' },
        { status: 500 }
      );
    }

    // Get query parameters for filtering
    let filteredScales = scales;
    
    try {
      const { searchParams } = new URL(request.url);
      const key = searchParams.get('key');
      const type = searchParams.get('type');

      if (key && key !== 'all') {
        filteredScales = filteredScales.filter((scale: any) => scale.key === key);
      }

      if (type && type !== 'all') {
        filteredScales = filteredScales.filter((scale: any) => scale.type === type);
      }
    } catch (urlError) {
      // If URL parsing fails, just return all scales
      console.warn('Error parsing URL parameters:', urlError);
    }

    return NextResponse.json(filteredScales);
  } catch (error: any) {
    console.error('Error reading scales file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load scales',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

