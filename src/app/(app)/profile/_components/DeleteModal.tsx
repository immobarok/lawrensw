import { useState } from "react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onDelete();
      setIsConfirming(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/87 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Are you sure you want to delete your account?
        </h3>
        <p className="text-sm text-gray-600 text-center mb-6">
          Press Delete Account to continue, or choose Cancel to go back.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={isConfirming}
            className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-colors ${
              isConfirming
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isConfirming ? "Deleting..." : "Delete Account"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-md text-gray-700 font-medium bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
