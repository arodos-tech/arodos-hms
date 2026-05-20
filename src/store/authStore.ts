import { proxy } from 'valtio';
import type { User } from '@/core/models';

interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    session: string | null;
    isInitValidated: boolean;
}

const getStoredUser = (): User | null => {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

const getStoredSession = (): string | null => localStorage.getItem('session');

const initialUser = getStoredUser();
const initialSession = getStoredSession();

export const authStore = proxy<AuthState>({
    user: initialUser,
    isInitValidated: false,
    session: initialSession,
    isLoggedIn: !!(initialUser && initialSession),
});

export const authActions = {
    login: (user: User, session: string) => {
        authStore.user = user;
        authStore.session = session;
        authStore.isLoggedIn = true;
        authStore.isInitValidated = true;
        localStorage.setItem('session', session);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('loginTimestamp', Date.now().toString());
    },
    logout: () => {
        authStore.user = null;
        authStore.session = null;
        authStore.isLoggedIn = false;
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTimestamp');
    },
    verifySession: async () => {
        const { fql } = await import('@/services/frontql/fqlClient');
        try {
            if (!authStore.user?.id) {
                authActions.logout();
                return;
            }
            const res = await fql.users.findOne(authStore.user.id.toString(), {
                fields: "id",
                useSession: true,
            });
            if (res.err) {
                authActions.logout();
            }
        } catch (err) {
            authActions.logout();
        } finally {
            authStore.isInitValidated = true;
        }
    }
};
