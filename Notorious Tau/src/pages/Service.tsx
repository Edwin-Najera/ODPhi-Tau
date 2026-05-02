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

  return (
    <div className="service-page">
      <h2>Service Highlights</h2>
      <div className="line-separate" style={{ padding: 0 }} />
      <div className="service-event-wrapper">
        {serviceEvents.map((service) => (
          <div key={service.id} className="service-event">
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
            <h3 className="service-title">{service.eventTitle}</h3>
            <img
              src={service.imageURL}
              alt="Service Event"
              className="service-img"
            />
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
