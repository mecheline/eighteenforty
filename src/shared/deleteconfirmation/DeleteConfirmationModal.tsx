import type React from "react";
import "./DeleteConfirmationModal.css";

interface DeleteConfirmationModalProps {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  taskTitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the task: "{taskTitle}"?</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-btn">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
