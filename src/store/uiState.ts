import { proxy } from 'valtio';

export interface ConfirmData {
    title?: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'danger' | 'primary';
}

interface UIState {
    alerts: Array<{
        id: string;
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
    }>;
    modals: {
        type: 'none' | 'create_booking' | 'view_booking' | 'create_guest' | 'create_order' | 'confirm';
        data: any;
    };
    activeTab: string;
    isUploading: boolean;
    isDelegated: boolean;
    delegationCode: string | null;
    confirm: ConfirmData | null;
}

export const uiStore = proxy<UIState>({
    alerts: [],
    modals: {
        type: 'none',
        data: null
    },
    activeTab: 'DASHBOARD',
    isUploading: false,
    isDelegated: false,
    delegationCode: null,
    confirm: null
});

export const uiActions = {
    setModal: (type: UIState['modals']['type'], data: any = null) => {
        uiStore.modals = { type, data };
    },
    addAlert: (message: string, type: UIState['alerts'][0]['type'] = 'info') => {
        const id = Math.random().toString(36).substring(7);
        uiStore.alerts.push({ id, message, type });
        setTimeout(() => {
            uiStore.alerts = uiStore.alerts.filter(a => a.id !== id);
        }, 3000);
    },
    setActiveTab: (tab: string) => {
        uiStore.activeTab = tab;
    },
    setConfirm: (data: ConfirmData | null) => {
        uiStore.confirm = data;
    },
    setIsDelegated: (isDelegated: boolean) => {
        uiStore.isDelegated = isDelegated;
    },
    setDelegationCode: (code: string | null) => {
        uiStore.delegationCode = code;
    }
};
