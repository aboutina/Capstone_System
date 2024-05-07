import create from 'zustand';

const useStore = create(set => ({
    downloadURL: '',
    setDownloadURL: (url) => set({ downloadURL: url }),
}));

export default useStore;