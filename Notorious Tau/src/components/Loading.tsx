import tribal from "./Photos/ODP_Tribal.png";
import "./global.css";

function Loading() {
  return (
    <div className="loading-wrapper">
      <div className="loading-container">
        <img className="loading-tribal" src={tribal} alt="tribal" />
      </div>
    </div>
  );

  return;
}

export default Loading;
