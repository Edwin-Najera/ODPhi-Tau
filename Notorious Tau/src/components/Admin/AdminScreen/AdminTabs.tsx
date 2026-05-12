import { useState, useEffect } from "react";
import type {
  BaseDocument,
  EventItem,
  Awards,
  Knights,
} from "../../EventsFolder/eventData";
import { handleDelete } from "../../../utils/handle";
import { useCollection } from "../../../utils/auth";
import "../../global.css";
import AdminPanel from "./AdminPanel";
import EditPopup from "../PopupFolder/EditPopup";

type Props = {
  collectionName: string;
  tabTitle: string;
  hasItems?: boolean;
  hasDate?: boolean;
  onlyPhotos?: boolean;
  activeHouse?: boolean;
  editId?: string | null;
};

function AdminTabs({
  collectionName,
  tabTitle,
  hasItems = false,
  hasDate = false,
  onlyPhotos = false,
  activeHouse = false,
  editId = null,
}: Props) {
  const documents = useCollection({ collectionName, activeHouse, onlyPhotos });
  const [editingId, setEditingId] = useState<string | null>(editId);
  const [editPopupOpen, setEditPopupOpen] = useState(!!editId);

  useEffect(() => {
    setEditingId(editId ?? null);
    setEditPopupOpen(false);
  }, [editId]);

  useEffect(() => {
    if (editingId && documents.length > 0) {
      setEditPopupOpen(true);
    }
  }, [editingId, documents]);

  const handleEdit = (event: BaseDocument) => {
    setEditingId(event.id);
    setEditPopupOpen(true);
  };
  return (
    <div className="tab-container">
      <h1>{tabTitle}</h1>
      <div className="admin-tab-panel">
        <AdminPanel
          collectionName={collectionName}
          hasItems={hasItems}
          hasDate={hasDate}
          onlyPhotos={onlyPhotos}
          activeHouse={activeHouse}
        />
      </div>
      {editPopupOpen && editingId && (
        <EditPopup
          onClose={() => {
            setEditPopupOpen(false);
            setEditingId(null);
          }}
          collectionName={collectionName}
          document={documents.find((event) => event.id === editingId) || null}
          hasDate={hasDate}
          hasItems={hasItems}
        />
      )}

      <div className={activeHouse ? "active-events knights" : "active-events"}>
        {onlyPhotos && (
          <>
            <h2>Active {tabTitle.toLowerCase()}</h2>
            {(documents as BaseDocument[]).map((document) => (
              <div key={document.id} className="gallery-image-container">
                <div>Gallery: {document.title}</div>
                <img
                  className="gallery-image"
                  src={document.imageURL}
                  alt="Gallery Photo"
                />
                <button
                  className="admin-btn delete-btn"
                  onClick={() =>
                    handleDelete(
                      collectionName,
                      document.id,
                      document.imagePath,
                    )
                  }
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}
        {activeHouse && (
          <>
            <h2>{tabTitle.toLowerCase()}</h2>
            {(documents as Knights[]).map((document) => (
              <div key={document.id}>
                {document.imageURL && (
                  <img
                    className="gallery-image"
                    src={document.imageURL}
                    alt="knight"
                  />
                )}
                <h6>{document.name}</h6>
                <div>{document.type}</div>
                <div>{document.position}</div>
                <div>{document.crossDate}</div>
                <div>{document.description}</div>
                {document.awards?.map((award: Awards, index: number) => (
                  <div className="item-row" key={index}>
                    <span>{award.title}</span>
                    <span>{award.year}</span>
                  </div>
                ))}
                <div className="event-actions">
                  <button
                    className="admin-btn edit-btn"
                    onClick={() => handleEdit(document)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn delete-btn"
                    onClick={() =>
                      handleDelete(
                        collectionName,
                        document.id,
                        document.imagePath,
                      )
                    }
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
        {!activeHouse && !onlyPhotos && (
          <>
            <h2>Active {tabTitle.toLowerCase()}</h2>
            {(documents as BaseDocument[]).map((document) => (
              <div key={document.id} className="view-mode-container">
                <h4>{document.title}</h4>
                <p>{document.description}</p>
                {document.date && (
                  <p className="date-view-container">
                    <strong>Date: </strong>
                    <br />
                    {new Date(document.date).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
                {document.items?.map((item: EventItem, index: number) => (
                  <div className="item-row" key={index}>
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
                <div className="event-actions">
                  <button
                    className="admin-btn edit-btn"
                    onClick={() => handleEdit(document)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn delete-btn"
                    onClick={() =>
                      handleDelete(
                        collectionName,
                        document.id,
                        document.imagePath,
                      )
                    }
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminTabs;
