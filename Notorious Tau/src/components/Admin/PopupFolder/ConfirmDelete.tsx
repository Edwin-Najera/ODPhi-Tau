import { handleDelete } from "../../../utils/handle";
import type { BaseDocument } from "../../EventsFolder/eventData";

type ConfirmDeleteProps = {
  document: BaseDocument;
  collectionName: string;
  onClose: () => void;
};

function ConfirmDelete({
  document,
  collectionName,
  onClose,
}: ConfirmDeleteProps) {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        {collectionName === "photos" ? (
          <div>
            <p>Delete Photo?</p>
            {document.imagePath && (
              <img src={document.imageURL} alt="" className="preview-image" />
            )}
          </div>
        ) : (
          <p>Delete {document.title}?</p>
        )}
        <div className="row">
          <button
            className="col admin-btn delete-btn"
            onClick={() => {
              handleDelete(collectionName, document.id, document.imagePath);
              onClose();
            }}
          >
            Confirm
          </button>
          <button className="admin-btn close-btn col ms-3" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
