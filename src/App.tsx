import { AppRouter } from '@/router';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Toaster } from "@/components/ui/sonner";
import '@/styles/App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tranzit-theme">
      <AppRouter />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
