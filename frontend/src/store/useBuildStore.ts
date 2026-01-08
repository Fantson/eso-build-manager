import { create } from 'zustand';
import axios from 'axios';

// Definicja jak wygląda Build (dla TypeScript)
interface Build {
  id: number;
  title: string;
  class: string;
  role: string;
}

interface BuildStore {
  builds: Build[];
  isLoading: boolean;
  error: string | null;
  fetchBuilds: () => Promise<void>;
}

// Tworzymy store (magazyn)
export const useBuildStore = create<BuildStore>((set) => ({
  builds: [],
  isLoading: false,
  error: null,

  // Funkcja do pobierania danych z Twojego Backendu
  fetchBuilds: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3000/builds');
      set({ builds: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Błąd pobierania danych', isLoading: false });
      console.error(error);
    }
  },
}));