import { create } from 'zustand/react'

interface SelectedFileState {
    selectedPath: string | null
    setSelectedPath: (path: string) => void
    reset: () => void
}

const useSelectedFileStore = create<SelectedFileState>((set, _get) => ({
    selectedPath: null,
    setSelectedPath: (path: string) => set({ selectedPath: path }),
    reset: () => set({ selectedPath: null }),
}))

export default useSelectedFileStore
