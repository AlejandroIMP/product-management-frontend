interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-500 hover:bg-red-600',
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
        <div className='mb-4'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>{title}</h2>
          <p className='text-gray-600'>{message}</p>
        </div>

        <div className='flex gap-3'>
          <button
            type='button'
            onClick={onClose}
            disabled={isLoading}
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors'
          >
            {cancelText}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50 transition-colors ${confirmButtonClass}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}