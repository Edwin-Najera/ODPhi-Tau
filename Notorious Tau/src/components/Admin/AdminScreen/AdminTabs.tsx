import { useState, useEffect } from "react";
import type {
  BaseDocument,
  EventItem,
  Knights,
} from "../../EventsFolder/eventData";
import { useCollection } from "../../../utils/auth";
import "../../global.css";
import AdminPanel from "./AdminPanel";
import EditPopup from "../PopupFolder/EditPopup";
import ConfirmDelete from "../PopupFolder/ConfirmDelete";

type Props = {
  collectionName: string;
  tabTitle: string;
  hasItems?: boolean;
  hasDate?: boolean;
  onlyPhotos?: boolean;
  activeHouse?: boolean;
  documentId?: string | null;
};

function AdminTabs({
  collectionName,
  tabTitle,
  hasItems = false,
  hasDate = false,
  onlyPhotos = false,
  activeHouse = false,
  documentId = null,
}: Props) {
  const documents = useCollection({ collectionName, activeHouse, onlyPhotos });
  const [action, setAction] = useState<{
    id: string | null;
    type: "edit" | "confirm" | null;
  }>({ id: documentId, type: null });
  const [popup, setPopup] = useState(!!documentId);

  useEffect(() => {
    if (documentId && documents.length > 0) {
      setAction({ id: documentId, type: "edit" });
    }
  }, [action, documents]);

  const handleBtnClick = (
    event: BaseDocument,
    type: "edit" | "confirm" | null,
  ) => {
    setAction({ id: event.id, type: type });
    setPopup(true);
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
      {popup && action.type === "edit" && action.id && (
        <EditPopup
          onClose={() => {
            setPopup(false);
            setAction({ id: null, type: null });
          }}
          collectionName={collectionName}
          document={documents.find((event) => event.id === action.id) || null}
          hasDate={hasDate}
          hasItems={hasItems}
          activeHouse={activeHouse}
        />
      )}
      {popup && action.type === "confirm" && (
        <ConfirmDelete
          onClose={() => {
            setPopup(false);
            setAction({ id: null, type: null });
          }}
          collectionName={collectionName}
          document={documents.find((event) => event.id === action.id) || null}
        />
      )}

      <div className={activeHouse ? "active-events knights" : "active-events"}>
        {onlyPhotos && (
          <>
            <h2>Active {tabTitle.toLowerCase()}</h2>
            {(documents as BaseDocument[]).map((document) => (
              <div key={document.id} className="gallery-image-container card">
                <div>Gallery: {document.title}</div>
                <img
                  className="gallery-image"
                  src={document.imageURL}
                  alt="Gallery Photo"
                />
                <button
                  className="admin-btn delete-btn"
                  onClick={() => handleBtnClick(document, "confirm")}
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
              <div key={document.id} className="gallery-image-container card">
                {document.imageURL && (
                  <img
                    className="gallery-image"
                    src={document.imageURL}
                    alt="knight"
                  />
                )}
                <h6>{document.name}</h6>
                <div>{document.type}</div>
                <div>{document.crossDate}</div>
                <div>{document.description}</div>
                <div className="event-actions">
                  <button
                    className="admin-btn edit-btn"
                    onClick={() => handleBtnClick(document, "edit")}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn delete-btn"
                    onClick={() => handleBtnClick(document, "confirm")}
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
              <div key={document.id} className="view-mode-container card">
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
                    onClick={() => handleBtnClick(document, "edit")}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn delete-btn"
                    onClick={() => handleBtnClick(document, "confirm")}
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
