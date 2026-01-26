# Homeland Union - Setup Guide

## Configuration Files Created

### 1. Tailwind CSS Configuration
- **`tailwind.config.js`**: Tailwind configuration with custom colors, fonts, and MUI conflict prevention
- **`postcss.config.js`**: PostCSS configuration for Tailwind processing

### 2. SCSS Structure
- **`src/styles/_variables.scss`**: Centralized SCSS variables (colors, spacing, typography, etc.)
- **`src/styles/main.scss`**: Main SCSS file with global styles and utilities

### 3. MUI Theme Configuration
- **`src/theme/theme.js`**: Complete MUI theme with custom colors, typography, and component overrides
- Includes font imports for Inter, Poppins, and Roboto

### 4. Context Providers
- **`src/contexts/AuthContext.jsx`**: Authentication context with login/logout functionality
- **`src/contexts/ConfigContext.jsx`**: Application configuration context (API URL, theme, language, etc.)

### 5. Updated Files
- **`vite.config.js`**: Added SCSS preprocessing and path aliases (`@` for `src/`)
- **`src/main.jsx`**: Wrapped app with ThemeProvider, Router, Context providers, and Toast notifications
- **`src/index.css`**: Added Tailwind directives and SCSS imports
- **`package.json`**: Added font source packages

## Installation Steps

1. **Install all dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API URL and configuration.

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Usage Examples

### Using SCSS Variables
```scss
// In any .scss file
.my-component {
  color: $primary-color;
  padding: $spacing-md;
  border-radius: $border-radius-lg;
}
```

### Using MUI Components
```jsx
import { Button, Card, Typography } from '@mui/material';

function MyComponent() {
  return (
    <Card>
      <Typography variant="h5">Title</Typography>
      <Button variant="contained">Click me</Button>
    </Card>
  );
}
```

### Using Tailwind Classes
```jsx
<div className="flex items-center justify-between p-4 bg-primary-500">
  <h1 className="text-2xl font-bold text-white">Title</h1>
</div>
```

### Using Contexts
```jsx
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/contexts/ConfigContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { config, updateConfig } = useConfig();
  
  // Use contexts...
}
```

### Using Path Aliases
```jsx
// Instead of: import { useAuth } from '../../../contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme/theme';
```

## Font Loading

The theme automatically loads Inter, Poppins, and Roboto fonts. They are imported in `src/theme/theme.js` and will be available throughout your application.

## Styling Strategy

1. **MUI Components**: Use for complex UI components (tables, date pickers, forms)
2. **Tailwind CSS**: Use for utility classes and quick styling
3. **SCSS**: Use for custom component styles and complex layouts
4. **MUI Theme**: Use for consistent colors, typography, and component styling

## Important Notes

- Tailwind's `preflight` is disabled to prevent conflicts with MUI
- SCSS variables are automatically imported in all `.scss` files via Vite config
- Use `@` alias for cleaner imports from the `src` directory
- Toast notifications are configured and ready to use with `react-hot-toast`

## Next Steps

1. Set up your routing structure in `src/App.jsx`
2. Create your page components
3. Set up API integration with SWR
4. Configure form handling with Formik and Yup
5. Add data visualization with ApexCharts
