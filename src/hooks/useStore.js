// store.js
import { create } from 'zustand'

export const useStore = create(set => ({
    userEmail: "",
    setUser: (email) => set({ userEmail: email }),
    removeAllUser: () => set({ userEmail: "" })
}))