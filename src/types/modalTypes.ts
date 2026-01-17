export interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    isLoading?: boolean;
}
export type DeleteModalState = {
    isOpen: boolean;
    type?: 'SINGLE' | 'BULK';
    targetId: number | null;
    title: string;
    message: string;
};