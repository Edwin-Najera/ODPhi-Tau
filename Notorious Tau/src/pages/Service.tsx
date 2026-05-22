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
      <div className="flex flex-wrap h-auto px-2 pt-3 w-100">
        {serviceEvents.map((service) => (
          <div
            key={service.id}
            className="service-event card flex-col-center text-start pos-relative w-50"
          >
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
            <img src={service.imageURL} alt="Service Event" className="pt-2" />
            <div className="card-body flex-start">
              <h3 className="card-title">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Service;
