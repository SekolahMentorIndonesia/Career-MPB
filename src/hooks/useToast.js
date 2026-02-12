import { create } from 'zustand';

const useToast = create((set) => ({
    toasts: [],
    addToast: (message, type = 'info', duration = 5000) => {
        const id = Date.now();
        set((state) => ({
            toasts: [...state.toasts, { id, message, type, duration }]
        }));
        return id;
    },
    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id)
        }));
    },
    clearToasts: () => set({ toasts: [] })
}));

// Helper functions for easier usage
export const toast = {
    success: (message, duration) => useToast.getState().addToast(message, 'success', duration),
    error: (message, duration) => useToast.getState().addToast(message, 'error', duration),
    warning: (message, duration) => useToast.getState().addToast(message, 'warning', duration),
    info: (message, duration) => useToast.getState().addToast(message, 'info', duration)
};

export default useToast;
