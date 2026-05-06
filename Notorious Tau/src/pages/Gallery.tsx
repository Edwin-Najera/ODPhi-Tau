import { Fragment } from "react";
import { useAuthRole, useCollection } from "../utils/auth";
import { handleDelete } from "../utils/handle";
import { FaTrash } from "react-icons/fa";

function Gallery() {
  const photos = useCollection({
    collectionName: "photos",
    onlyPhotos: true,
    activeHouse: false,
  }).filter((photo) => photo.id.startsWith("gallery_"));
  const { userRole } = useAuthRole();

  return (
    <div className="odphi-gallery-page">
      <div className="odphi-gallery-title">
        <h1>
          Omega Delta Phi
          <br />
          Year Highlights
        </h1>
      </div>
      <div className="odphi-gallery-container">
        {photos.map((photo, index) => (
          <Fragment key={index}>
            <div className="gallery-card">
              {userRole === "admin" && (
                <button
                  className="btn trash-can-wrapper"
                  onClick={() =>
                    handleDelete("photos", photo.id, photo.imagePath)
                  }
                >
                  <FaTrash className="trash-can" />
                </button>
              )}
              <img src={photo.imageURL} className="odphi-gallery-image" />
              <div className="line-separate" />
              <p className="image-description">{photo.description}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
