import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/router';
import { ThemeProvider } from '@/app/providers/theme-provider';
import '@/styles/App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tranzit-theme">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
