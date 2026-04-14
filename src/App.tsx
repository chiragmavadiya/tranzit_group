import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/router';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Toaster } from "@/components/ui/sonner";
import '@/styles/App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tranzit-theme">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
