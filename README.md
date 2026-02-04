# Expense Tracker

A modern, responsive expense tracking application built with React.

## Features

✅ **Multi-Currency Support** - Track expenses in 15 different currencies (USD, EUR, GBP, INR, AUD, CAD, JPY, CNY, MXN, BRL, AED, SGD, HKD, NZD, CHF)

✅ **Category Filtering** - Organize expenses by 8 categories (Food, Transport, Shopping, Bills, Entertainment, Healthcare, Education, Other)

✅ **Monthly Statistics** - View spending breakdown by month and category with visual percentages

✅ **Dark Mode** - Toggle between light and dark themes

✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop devices

✅ **Local Storage** - All data persists in your browser (no server needed)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm start
```

Runs the app in development mode at http://localhost:3000

### Production Build

```bash
npm run build
```

Creates optimized production build in the `build/` folder

## Usage

1. **Add Expense**
   - Select currency for the expense
   - Enter amount, category, description, and date
   - Click Add Expense

2. **View Expenses**
   - See all expenses in the list
   - Each expense displays its original currency
   - Click Delete to remove an expense

3. **Filter by Category**
   - Use the Filter dropdown to see expenses from specific categories
   - Click Clear Filter to see all expenses

4. **View Statistics**
   - Select a currency to view statistics for that currency only
   - See total spending, average expense, and breakdown by category/month

5. **Switch Themes**
   - Click the Dark/Light mode button in the header to toggle themes

## Technology Stack

- **React 18.2.0** - UI framework
- **React Router 7.13.0** - Client-side routing
- **CSS3** - Responsive styling
- **localStorage** - Data persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
Expense Tracker/
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.js           # Main app component
│   │   ├── index.css        # Global styles
│   │   └── index.js         # Entry point
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── build/               # Production build
│   ├── package.json         # Dependencies
│   └── node_modules/        # Installed packages
└── README.md                # This file
```

## Deployment

The production build is ready to deploy to any static hosting:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `build/` folder
- **GitHub Pages**: Push `build/` folder to gh-pages branch
- **Any HTTP server**: Serve `build/` folder

## Currencies Supported

USD, EUR, GBP, INR, AUD, CAD, JPY, CNY, MXN, BRL, AED, SGD, HKD, NZD, CHF

## Expense Categories

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Healthcare
- Education
- Other

## Statistics Features

- Total expenses for selected currency
- Average expense amount
- Spending by category (with percentages)
- Monthly spending trends

## Color Scheme

**Light Mode:**
- Primary: Purple (#7c3aed)
- Background: Light purple (#f8f6ff)
- Text: Deep navy (#1a1a2e)

**Dark Mode:**
- Primary: Lavender (#a78bfa)
- Background: Deep navy (#0f0f1e)
- Text: Light purple (#f0f0ff)

## Performance

- Gzipped JS: ~48.65 kB
- Gzipped CSS: ~3.39 kB
- Optimized for mobile devices
- Smooth animations and transitions

## License

This project is open source and available under the MIT License.

---

**Made with ❤️ using React**
