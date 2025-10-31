# Piano Chords Database

A comprehensive Next.js application for exploring piano chords and musical scales with interactive audio and bilingual support (English/French).

## Features

- 🎹 **Complete Piano Chords Database** - Browse over 300 piano chords
- 🎵 **Musical Scales Navigator** - Explore 476+ musical scales
- 🌍 **Bilingual Support** - Full English and French translation
- 🎼 **Interactive Piano Keyboard** - Visual representation of chords and scales
- 🔍 **Advanced Search & Filters** - Search by name, root note, type, or notes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Tone.js** (for audio synthesis)

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd piano-chords-api
```

2. Install dependencies:
```bash
npm install
```

3. Generate chord and scale data (if needed):
```bash
npm run generate-chords
npm run generate-scales
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run generate-chords` - Generate piano chords data
- `npm run generate-scales` - Generate musical scales data

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page (chords list)
│   ├── chords/            # Chord detail pages
│   └── scales/            # Scale pages
├── components/            # React components
│   ├── Navigation.tsx
│   ├── PianoKeyboard.tsx
│   └── LanguageSwitcher.tsx
├── contexts/              # React contexts
│   └── LanguageContext.tsx
├── lib/                   # Utilities
│   └── translations.ts    # Translation logic
├── data/                  # JSON data files
│   ├── chords.json
│   └── scales.json
└── scripts/               # Data generation scripts
```

## Features

### Chords
- Search and filter chords by root note, type, or name
- View chord details with piano keyboard visualization
- See chord notes, intervals, inversions, and related chords

### Scales
- Browse scales by key and type
- View scale details with piano keyboard visualization
- See scale notes and intervals

### Translations
- Switch between English and French
- All UI text translated
- Musical notes displayed in solfège (Do Re Mi...) for French
- Chord and scale names translated

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Install dependencies: `npm install`

### Vercel

The project is optimized for Vercel deployment:

```bash
vercel
```

## License

MIT

## Acknowledgments

- Chord and scale data structure inspired by [scales-chords.com](https://www.scales-chords.com)
