import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Run the scraper script
    const { stdout, stderr } = await execAsync('npm run scrape', {
      cwd: process.cwd(),
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    return NextResponse.json({
      success: true,
      message: 'Scraping started successfully',
      output: stdout,
      error: stderr,
    });
  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to start scraping',
      },
      { status: 500 }
    );
  }
}

