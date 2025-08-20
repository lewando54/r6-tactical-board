# R6 Tactical Board

A tactical planning tool for Rainbow Six Siege teams. This web application provides an interactive map interface for strategic planning, operator placement, and tactical coordination.

## Features

- **Interactive Map Interface**: Navigate through different floors of Rainbow Six Siege maps
- **Operator Placement**: Place and manage operator positions on tactical maps
- **Multi-language Support**: Available in English and Polish
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Collaboration**: Share tactical plans with your team

## Supported Maps

Currently supported maps include:
- Oregon
- Skyscraper
- More maps coming soon...

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/r6-tactical-board.git
cd r6-tactical-board
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Usage

1. **Select a Map**: Choose from the available maps on the main menu
2. **Navigate Floors**: Use the floor switcher to view different levels of the map
3. **Place Operators**: Use the operator selector to place team members on the map
4. **Plan Tactics**: Use the drawing tools to mark strategic positions and routes
5. **Share Plans**: Export or share your tactical plans with your team

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Graphics**: Konva.js for canvas-based interactions
- **Internationalization**: i18next
- **Routing**: React Router DOM
- **Icons**: React Icons and Twemoji

## Project Structure

```
src/
├── components/          # Shared components
├── features/           # Feature-based modules
│   └── map/           # Map-related functionality
│       ├── components/ # Map-specific components
│       ├── contexts/   # React contexts
│       ├── hooks/      # Custom hooks
│       ├── types/      # TypeScript type definitions
│       └── utils/      # Utility functions
├── pages/              # Page components
├── lib/                # Library configurations
└── i18n.ts            # Internationalization setup
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Rainbow Six Siege community for inspiration
- Ubisoft for the Rainbow Six Siege franchise
- All contributors and supporters of this project
