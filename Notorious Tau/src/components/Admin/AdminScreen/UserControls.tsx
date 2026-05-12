import type { NavigateFunction } from "react-router-dom";
import { handleDelete, handleNavigate } from "../../../utils/handle";
import type { BaseDocument } from "../../EventsFolder/eventData";
import { FaTrash } from "react-icons/fa";

type UserControlProps = {
  userRole: string | null;
  collectionName: string;
  event: BaseDocument;
  navigate: NavigateFunction;
};

function UserControls({
  userRole,
  collectionName,
  event,
  navigate,
}: UserControlProps) {
  return (
    <>
      {userRole === "admin" && (
        <>
          <button
            className="trash-can-wrapper"
            onClick={() => {
              handleDelete(collectionName, event.id, event.imagePath);
            }}
          >
            <FaTrash className="trash-can" />
          </button>
          <button
            className="edit-btn-wrapper"
            onClick={() =>
              handleNavigate(navigate, "Onlybros", {
                panel: collectionName,
                editId: event.id,
              })
            }
          >
            Edit
          </button>
        </>
      )}
    </>
  );
}

export default UserControls;
