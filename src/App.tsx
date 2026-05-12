import { AppRouter } from '@/router';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Toaster } from "@/components/ui/sonner";
import '@/styles/App.css';
import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tranzit-theme">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <AppRouter />
        <Toaster />
      </APIProvider>
    </ThemeProvider>
  );
}

export default App;
