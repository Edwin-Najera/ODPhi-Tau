import { useState } from "react";
import { useAuthRole, useCollection } from "../utils/auth";
import { handleDelete } from "../utils/handle";
import { FaTrash } from "react-icons/fa";

function Service() {
  const serviceEvents = useCollection({
    collectionName: "service",
    activeHouse: false,
    onlyPhotos: false,
  });
  const { userRole } = useAuthRole();
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });

  return (
    <>
      <div className="page">
        <div className="flex-col-center w-100">
          <h1>Service Highlights</h1>
          <button
            className="btn btn-primary pos-absolute align-self-end me-3"
            onClick={() =>
              setPopup({
                show: true,
                message: "Collaborate on Service Events?",
                type: "active",
              })
            }
          >
            Collaborate on Service Events?
          </button>
          <div className="line-separate p-0" />
        </div>
        <div className="odphi-gallery-container">
          {serviceEvents.map((service) => (
            <div key={service.id} className="gallery-card">
              {userRole === "admin" && (
                <button
                  className="trash-can-wrapper"
                  onClick={() =>
                    handleDelete("service", service.id, service.imagePath)
                  }
                >
                  <FaTrash className="trash-can" />{" "}
                </button>
              )}
              <img
                src={service.imageURL}
                alt="Service Event"
                className="odphi-gallery-image"
              />
              <div className="flex-col-center align-items-start w-100 px-3">
                <h3 className="card-title">{service.title}</h3>
                <div className="line-separate w-100" />
                <p className="image-description text-start ps-2">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {popup.show && (
        <CollaboratePopup
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "", type: null })}
        />
      )}
    </>
  );
}

const CollaboratePopup = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        <h2>{message}</h2>
        <p>
          Thank you for your interest in collaborating with us for service
          events!
        </p>
        <p>
          Please contact our service chair. Below is their contact information:
        </p>
        <div className="reach-email flex-col">
          <span>
            <a href="mailto:service.tau@omegadeltaphi.org">
              service.tau@omegadeltaphi.org
            </a>
          </span>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Service;
