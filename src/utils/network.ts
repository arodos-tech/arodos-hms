import { proxy } from 'valtio';

export const networkStore = proxy({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
});

if (typeof window !== 'undefined') {
    window.addEventListener('online', () => { networkStore.isOnline = true; });
    window.addEventListener('offline', () => { networkStore.isOnline = false; });
}
