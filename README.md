# R6 Tactical Board

A tactical planning tool for Rainbow Six Siege. Place operators, draw routes, and mark utility on multi-floor map blueprints. Plans can be exported and imported as JSON.

## Features

- Interactive Konva canvas with pan and zoom
- Operator placement from the `r6operators` catalog
- Drawing tools: marker, arrow, freehand, eraser, text, legend icons
- Multi-floor maps with optional admin callouts
- English and Polish UI
- Strategy export/import (JSON)

## Supported maps

Maps are listed in `public/maps/index.json`. Currently:

- Oregon
- Skyscraper

Blueprint and menu images live under `public/maps/{mapId}/` and are referenced by filename in the index (and per-floor `image` fields). Optional overlays go in `public/maps/{mapId}/config.json`.

## Getting started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/your-username/r6-tactical-board.git
cd r6-tactical-board
npm install
npm run dev
```

Open `http://localhost:5173`.

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck and production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

GitHub Pages builds set `VITE_BASE=/r6-tactical-board/`.

## Usage

1. Choose a map on the menu
2. Switch floors with the floor panel
3. Place operators and draw tactics with the toolbar
4. Export a strategy JSON to share; import it later on the same map

## Map index shape

```json
{
  "maps": [
    {
      "id": "oregon",
      "nameKey": "maps.oregon",
      "menuImage": "r6-maps-oregon.jpg",
      "floors": [
        {
          "nameKey": "map.basement",
          "floorNumber": -1,
          "image": "r6-maps-oregon-blueprint-1.jpg"
        }
      ]
    }
  ]
}
```

## Technology stack

- React 19 and TypeScript
- Vite
- Tailwind CSS
- Konva / react-konva
- i18next
- React Router
- Zod (runtime validation for map and strategy JSON)
- r6operators (operator icons and names)

## Project structure

```
src/
├── components/          # Shared UI (Modal, LanguageSwitcher)
├── features/map/        # Canvas, tools, state, schemas
├── lib/                 # Map loading and operator catalog
├── locales/             # EN/PL translations
├── pages/               # Menu and map routes
└── i18n.ts
public/maps/             # Map registry, blueprints, admin overlays
```

## License

GNU General Public License v3.0 — see [LICENSE](LICENSE).
