import { useState } from 'react';
import type { AlertType } from '../components/ui/AlertModal';

interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
}

export function useAlert() {
  const [alertModal, setAlertModal] = useState<AlertState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (type: AlertType, title: string, message: string, onConfirm?: () => void) => {
    setAlertModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
    });
  };

  const closeAlert = () => {
    if (alertModal.onConfirm) {
      alertModal.onConfirm();
    }
    setAlertModal({ ...alertModal, isOpen: false });
  };

  // Convenience methods for different alert types
  const showSuccess = (title: string, message: string, onConfirm?: () => void) => {
    showAlert('success', title, message, onConfirm);
  };

  const showError = (title: string, message: string, onConfirm?: () => void) => {
    showAlert('error', title, message, onConfirm);
  };

  const showWarning = (title: string, message: string, onConfirm?: () => void) => {
    showAlert('warning', title, message, onConfirm);
  };

  const showInfo = (title: string, message: string, onConfirm?: () => void) => {
    showAlert('info', title, message, onConfirm);
  };

  return {
    alertModal,
    showAlert,
    closeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}