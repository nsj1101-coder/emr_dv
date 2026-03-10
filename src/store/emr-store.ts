import { create } from "zustand";

interface EMRState {
  selectedPatientId: string | null;
  sidebarOpen: boolean;
  currentView: string;
  setSelectedPatient: (id: string | null) => void;
  toggleSidebar: () => void;
  setCurrentView: (view: string) => void;
}

export const useEMRStore = create<EMRState>((set) => ({
  selectedPatientId: null,
  sidebarOpen: true,
  currentView: "dashboard",
  setSelectedPatient: (id) => set({ selectedPatientId: id }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setCurrentView: (view) => set({ currentView: view }),
}));
