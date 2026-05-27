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
    <div className="page">
      <div className="flex-col-center w-100">
        <h1>Service Highlights</h1>
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
  );
}

export default Service;
