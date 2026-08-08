import Modal from "./Modal";

function AlertPopup({ isOpen, message, onClose }) {
  return (
    <Modal open={isOpen} title="Notice" onClose={onClose}>
      <p className="text-gray-700">{message}</p>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-[#4f8c89] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#376c69]"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}

export default AlertPopup;
