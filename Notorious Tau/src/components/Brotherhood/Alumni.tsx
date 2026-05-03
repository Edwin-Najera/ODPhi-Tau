import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection, useAuthRole } from "../../utils/auth";
import "../global.css";
import Popup from "../Admin/PopupFolder/Popup";

function Alumni() {
  const [showPopup, setShowPopup] = useState(false);
  const { userRole } = useAuthRole();
  const events = useCollection({
    collectionName: "alumni",
    activeHouse: false,
    onlyPhotos: false,
  });
  const updates = useCollection({
    collectionName: "campus",
    activeHouse: false,
    onlyPhotos: false,
  });
  const gallery = useCollection({
    collectionName: "photos",
    activeHouse: false,
    onlyPhotos: true,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleNavigate = async (location: string) => {
    if (
      (userRole === "admin" || userRole === "active") &&
      location == "onlybros"
    ) {
      navigate("/Onlybros");
    } else if (location === "alumni") {
      navigate("/AllBros");
    } else {
      setMessage("Only Admin and Actives allowed");
      setShowPopup(true);
    }
  };

  return (
    <div className="alumni-page">
      <div className="top-of-page">
        <button
          className="return-admin"
          onClick={() => handleNavigate("onlybros")}
        >
          Admin Page
        </button>
        <button
          className="return-admin return-previous"
          onClick={() => handleNavigate("alumni")}
        >
          Brotherhood Page
        </button>
      </div>
      {showPopup && (
        <Popup
          message={message}
          onClose={() => setShowPopup(false)}
          collectionName=""
          autoClose={true}
        />
      )}
    </div>
  );
}

export default Alumni;
