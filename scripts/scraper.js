const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const https = require('https');

// Configuration
const BASE_URL = 'https://www.scales-chords.com';
const DELAY_MS = 1000; // 1 second delay between requests
const OUTPUT_FILE = path.join(__dirname, '../data/chords.json');
const IMAGES_DIR = path.join(__dirname, '../public/chords');

// Ensure directories exist
fs.ensureDirSync(path.dirname(OUTPUT_FILE));
fs.ensureDirSync(IMAGES_DIR);

// Helper function to delay execution
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to download images
const downloadImage = async (url, filepath) => {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
    
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download image ${url}:`, error.message);
  }
};

// Parse note from text (e.g., "C E G" -> ["C", "E", "G"])
const parseNotes = (text) => {
  if (!text) return [];
  return text
    .trim()
    .split(/\s+/)
    .map((note) => note.trim())
    .filter((note) => note.length > 0);
};

// Parse intervals from text (e.g., "1 3 5" -> ["1", "3", "5"])
const parseIntervals = (text) => {
  if (!text) return [];
  return text
    .trim()
    .split(/\s+/)
    .map((interval) => interval.trim())
    .filter((interval) => interval.length > 0);
};

// Extract chord data from individual chord page
const extractChordData = async (chordUrl, chordSymbol) => {
  try {
    await delay(DELAY_MS);
    const response = await axios.get(chordUrl, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    
    // Extract chord name
    const fullName = $('h1').first().text().trim() || chordSymbol;
    
    // Extract description/aka
    const description = $('h2.desctitle').text().trim() || '';
    
    // Extract notes from the table
    const notes = [];
    const intervals = [];
    
    $('table tbody tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const label = $(cells[0]).text().trim();
        const values = $(cells[1]).text().trim();
        
        if (label === 'Notes') {
          notes.push(...parseNotes(values));
        } else if (label === 'Intervals') {
          intervals.push(...parseIntervals(values));
        }
      }
    });

    // Extract from description if table doesn't have it
    const descMatch = description.match(/notes?\s+([A-G][#b]?\s*)+/i);
    if (notes.length === 0 && descMatch) {
      notes.push(...parseNotes(descMatch[1]));
    }

    // Extract piano image URL
    const pianoImageUrl = $('img[src*="chord-charts/piano"]').first().attr('src');
    let pianoImageLocal = null;

    if (pianoImageUrl) {
      const fullImageUrl = pianoImageUrl.startsWith('http') 
        ? pianoImageUrl 
        : `${BASE_URL}${pianoImageUrl}`;
      
      const imageFilename = pianoImageUrl.split('/').pop();
      const imagePath = path.join(IMAGES_DIR, imageFilename);
      
      if (!fs.existsSync(imagePath)) {
        await downloadImage(fullImageUrl, imagePath);
        await delay(500); // Small delay after image download
      }
      
      pianoImageLocal = `/chords/${imageFilename}`;
    }

    // Extract alternate symbols
    const alternateSymbols = [];
    $('a.chlink').each((i, el) => {
      const text = $(el).text().trim();
      if (text && text !== chordSymbol && !alternateSymbols.includes(text)) {
        alternateSymbols.push(text);
      }
    });

    // Extract inversions
    const inversions = [];
    $('#inversions img').each((i, img) => {
      const src = $(img).attr('src');
      const alt = $(img).attr('alt') || '';
      const inversionMatch = alt.match(/([A-G][#b]?[a-z0-9]*)\\([A-G][#b]?)/);
      if (inversionMatch) {
        inversions.push({
          name: `${inversionMatch[1]}\\${inversionMatch[2]}`,
          notes: parseNotes(alt.match(/notes:\s+([A-G][#b]?\s*)+/i)?.[1] || ''),
        });
      }
    });

    // Extract related chords
    const relatedChords = [];
    $('#related a.chlinkpad').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && text !== chordSymbol) {
        relatedChords.push({
          name: text,
          url: href ? (href.startsWith('http') ? href : `${BASE_URL}${href}`) : null,
        });
      }
    });

    return {
      symbol: chordSymbol,
      fullName: fullName.replace('Piano Chord', '').trim(),
      description,
      notes,
      intervals,
      alternateSymbols,
      inversions,
      relatedChords,
      imageUrl: pianoImageUrl ? (pianoImageUrl.startsWith('http') ? pianoImageUrl : `${BASE_URL}${pianoImageUrl}`) : null,
      imageLocal: pianoImageLocal,
      url: chordUrl,
    };
  } catch (error) {
    console.error(`Error extracting data for ${chordUrl}:`, error.message);
    return null;
  }
};

// Get all chords from a listing page
const getChordsFromPage = async (url, page = 1) => {
  try {
    const pageUrl = page > 1 ? `${url}&page=${page}` : url;
    await delay(DELAY_MS);
    
    const response = await axios.get(pageUrl, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const chords = [];
    const chordUrls = new Set();

    // Extract chord links from table
    $('table.scaleinfotable a.chlink, table tbody a.chlink').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      
      if (href && text) {
        const pianoUrl = href.replace('/guitar/', '/piano/');
        if (pianoUrl.startsWith('/chord/piano/') || pianoUrl.includes('/chord/piano/')) {
          const fullUrl = pianoUrl.startsWith('http') ? pianoUrl : `${BASE_URL}${pianoUrl}`;
          const chordSymbol = text.trim();
          
          if (!chordUrls.has(fullUrl)) {
            chordUrls.add(fullUrl);
            chords.push({
              symbol: chordSymbol,
              url: fullUrl,
            });
          }
        }
      }
    });

    // Check if there's a next page
    const nextPageLink = $('a[href*="page="]').filter((i, el) => {
      const text = $(el).text().trim();
      return text === '►' || (text && /^\d+$/.test(text) && parseInt(text) === page + 1);
    }).first();

    const hasNextPage = nextPageLink.length > 0;
    
    return { chords, hasNextPage };
  } catch (error) {
    console.error(`Error fetching page ${url}:`, error.message);
    return { chords: [], hasNextPage: false };
  }
};

// Main scraping function
const scrapeAllChords = async () => {
  console.log('Starting chord scraping...');
  
  const allChordsMap = new Map(); // Use Map to deduplicate by symbol
  const allChordUrls = new Set();

  // Keys to scrape
  const keys = [
    'A', 'A#', 'Ab', 'B', 'Bb', 'C', 'C#', 'D', 'D#', 'Db', 'E', 'Eb', 'F', 'F#', 'G', 'G#', 'Gb'
  ];

  // Chord types to scrape
  const types = [
    'major', 'm', 'aug', 'dim', 'sus2', 'sus4', '5', '6', 'm6', '6/9',
    '7', 'm7', 'm(maj7)', 'maj7', 'º7', 'm7b5', '7#5', '7b5', '7sus2', '7sus4',
    '9', 'm9', 'maj9', '9#5', '9b5', '9sus2', '9sus4', 'm11',
    '13', 'm13', 'maj13'
  ];

  // First, try to scrape from the full database page
  console.log('Attempting to scrape from full database page...');
  try {
    const fullDbUrl = `${BASE_URL}/chord-database/`;
    await delay(DELAY_MS);
    const response = await axios.get(fullDbUrl, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    const $ = cheerio.load(response.data);
    // Extract all chord links from the database page
    $('a[href*="/chord/piano/"]').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      
      if (href && text) {
        const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
        if (!allChordUrls.has(fullUrl)) {
          allChordUrls.add(fullUrl);
          // Extract later in batch
        }
      }
    });
  } catch (error) {
    console.log('Could not access full database page, continuing with individual pages...');
  }

  // Scrape by keys
  console.log('Scraping chords by keys...');
  for (const key of keys) {
    console.log(`\nScraping chords for key: ${key}`);
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `${BASE_URL}/showchbykey.php?key=${encodeURIComponent(key)}`;
      const { chords, hasNextPage } = await getChordsFromPage(url, page);
      
      console.log(`  Page ${page}: Found ${chords.length} chords`);
      
      for (const chord of chords) {
        if (!allChordUrls.has(chord.url)) {
          allChordUrls.add(chord.url);
          
          // Extract detailed chord data
          console.log(`    Extracting: ${chord.symbol}`);
          const chordData = await extractChordData(chord.url, chord.symbol);
          
          if (chordData) {
            // Use symbol as key to deduplicate
            if (!allChordsMap.has(chordData.symbol)) {
              allChordsMap.set(chordData.symbol, chordData);
            } else {
              // Merge data if chord already exists
              const existing = allChordsMap.get(chordData.symbol);
              existing.alternateSymbols = [
                ...new Set([...existing.alternateSymbols, ...chordData.alternateSymbols])
              ];
            }
          }
        }
      }

      hasMore = hasNextPage;
      page++;
      
      if (page > 50) break; // Safety limit
    }
  }

  // Scrape by types
  console.log('\nScraping chords by types...');
  for (const type of types) {
    console.log(`\nScraping chords for type: ${type}`);
    const url = `${BASE_URL}/show-chord-by-type.php?type=${encodeURIComponent(type)}`;
    const { chords, hasNextPage } = await getChordsFromPage(url, 1);
    
    let page = 1;
    let hasMore = hasNextPage;
    
    while (hasMore) {
      console.log(`  Page ${page}: Found ${chords.length} chords`);
      
      for (const chord of chords) {
        if (!allChordUrls.has(chord.url)) {
          allChordUrls.add(chord.url);
          
          console.log(`    Extracting: ${chord.symbol}`);
          const chordData = await extractChordData(chord.url, chord.symbol);
          
          if (chordData) {
            if (!allChordsMap.has(chordData.symbol)) {
              allChordsMap.set(chordData.symbol, chordData);
            } else {
              const existing = allChordsMap.get(chordData.symbol);
              existing.alternateSymbols = [
                ...new Set([...existing.alternateSymbols, ...chordData.alternateSymbols])
              ];
            }
          }
        }
      }

      hasMore = hasNextPage && page < 50;
      page++;
    }
  }

  // Convert Map to Array
  const allChords = Array.from(allChordsMap.values());
  
  console.log(`\n\nTotal unique chords scraped: ${allChords.length}`);
  
  // Save to JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allChords, null, 2), 'utf-8');
  console.log(`\nChords saved to: ${OUTPUT_FILE}`);
  
  return allChords;
};

// Run scraper
if (require.main === module) {
  scrapeAllChords()
    .then(() => {
      console.log('\nScraping completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\nScraping failed:', error);
      process.exit(1);
    });
}

module.exports = { scrapeAllChords };

