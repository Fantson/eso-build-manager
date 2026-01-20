import { create } from 'zustand';
import axios from 'axios';

interface Item {
  id: number;
  name: string;
  slot: string;
  trait: string;
}

interface Build {
  id: number;
  title: string;
  class: string;
  role: string;
  items: Item[];
}

interface CreateBuildData {
  title: string;
  class: string;
  role: string;
}

interface CreateItemData {
  name: string;
  slot: string;
  trait: string;
  buildId: number;
}

interface UpdateBuildData {
  id: number;
  title?: string;
  class?: string;
  role?: string;
}

interface BuildStore {
  builds: Build[];
  // --- ZMIENNE DO PAGINACJI ---
  totalPages: number;
  currentPage: number;
  totalBuilds: number;
  
  isLoading: boolean;
  error: string | null;

  // Zmiana: fetchBuilds przyjmuje numer strony
  fetchBuilds: (page?: number) => Promise<void>;
  
  addBuild: (newBuild: CreateBuildData) => Promise<void>;
  deleteBuild: (id: number) => Promise<void>;
  updateBuild: (updatedBuild: UpdateBuildData) => Promise<void>;
  addItem: (newItem: CreateItemData) => Promise<void>;
  deleteItem: (itemId: number, buildId: number) => Promise<void>;
  equipItem: (newItem: CreateItemData) => Promise<void>;
}

export const useBuildStore = create<BuildStore>((set, get) => ({
  builds: [],
  // Domyślne wartości paginacji
  totalPages: 1,
  currentPage: 1,
  totalBuilds: 0,
  
  isLoading: false,
  error: null,

  // --- 1. POBIERANIE Z PAGINACJĄ ---
  fetchBuilds: async (page = 1) => {
    set({ isLoading: true });
    try {
      // Limit 6 pasuje do Twojego układu kart (grid)
      const response = await axios.get(`http://localhost:3000/builds?page=${page}&limit=6`);
      
      // Backend zwraca teraz obiekt: { data, total, page, lastPage }
      const { data, lastPage, total } = response.data;

      set({ 
        builds: data, 
        totalPages: lastPage,
        currentPage: page,
        totalBuilds: total,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Błąd pobierania', isLoading: false });
    }
  },
  
  addBuild: async (newBuild) => {
    set({ isLoading: true });
    try {
      await axios.post('http://localhost:3000/builds', newBuild);
      // Po dodaniu odświeżamy pierwszą stronę, żeby zobaczyć nowy build
      await get().fetchBuilds(1);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Nie udało się dodać buildu', isLoading: false });
    }
  },

  updateBuild: async (updatedData) => {
    try {
      const response = await axios.patch(`http://localhost:3000/builds/${updatedData.id}`, updatedData);
      const serverUpdatedBuild = response.data;

      set((state) => ({
        builds: state.builds.map((build) => 
          build.id === updatedData.id 
            ? { ...build, ...serverUpdatedBuild, items: build.items }
            : build
        )
      }));
    } catch (error) {
      console.error('Błąd aktualizacji:', error);
    }
  },

  deleteBuild: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/builds/${id}`);
      // Po usunięciu odświeżamy obecną stronę
      const currentPage = get().currentPage;
      await get().fetchBuilds(currentPage);
    } catch (error) {
      console.error('Błąd usuwania buildu:', error);
    }
  },

  addItem: async (newItem) => {
    try {
      const response = await axios.post('http://localhost:3000/items', newItem);
      const createdItem = response.data;
      set((state) => ({
        builds: state.builds.map((build) => {
          if (build.id === newItem.buildId) {
            return { ...build, items: [...(build.items || []), createdItem] };
          }
          return build;
        })
      }));
    } catch (error) {
      console.error('Błąd dodawania przedmiotu:', error);
    }
  },

  deleteItem: async (itemId, buildId) => {
    try {
      await axios.delete(`http://localhost:3000/items/${itemId}`);
      set((state) => ({
        builds: state.builds.map((build) => {
          if (build.id === buildId) {
            return {
              ...build,
              items: build.items.filter((item) => item.id !== itemId)
            };
          }
          return build;
        })
      }));
    } catch (error) {
      console.error('Błąd usuwania przedmiotu:', error);
    }
  },

  // --- 2. OBSŁUGA EQUIP ITEM (DLA EDYTORA) ---
  equipItem: async (newItem) => {
    const store = get();
    const build = store.builds.find(b => b.id === newItem.buildId);
    if (!build) return;

    // Sprawdź czy coś jest w slocie
    const existingItem = build.items.find(item => item.slot === newItem.slot);
    
    try {
      // Jeśli jest - usuń z bazy
      if (existingItem) {
        await axios.delete(`http://localhost:3000/items/${existingItem.id}`);
      }

      // Dodaj nowy
      const response = await axios.post('http://localhost:3000/items', newItem);
      const createdItem = response.data;

      // Zaktualizuj stan lokalnie (podmień item w tablicy)
      set((state) => ({
        builds: state.builds.map((b) => {
          if (b.id === newItem.buildId) {
            const cleanItems = b.items.filter(i => i.slot !== newItem.slot);
            return { ...b, items: [...cleanItems, createdItem] };
          }
          return b;
        })
      }));
    } catch (error) {
      console.error('Błąd equipItem:', error);
    }
  },
}));