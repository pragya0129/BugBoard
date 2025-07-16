const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <button onClick={onClose} className="float-right text-gray-600">
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
