import {} from "react/jsx-runtime";
import { useInView } from "react-intersection-observer";
import "../global.css";

function School() {
  const { ref: myRef, inView: visibleElement } = useInView({
    triggerOnce: true,
  });
  let blaze = "";

  if (visibleElement) {
    blaze = "school-container";
  }
  return (
    <>
      <div ref={myRef} className={blaze}>
        <h1>UTA Resources</h1>
        <div className="row resources-row">
          <div className="col help-resources">
            <h6>Student Help</h6>
            <ul className="help-list">
              <li className="school-list-item">
                <a
                  className="click-button"
                  href="https://www.uta.edu/student-affairs/caps"
                  target="_blank"
                >
                  Counseling
                </a>
              </li>
              <li className="school-list-item">
                <a
                  className="click-button"
                  href="http://www.uta.edu/healthservices/"
                  target="_blank"
                >
                  Health Services
                </a>
              </li>
              <li className="school-list-item">
                <a
                  className="click-button"
                  href="https://www.uta.edu/student-affairs/student-support"
                  target="_blank"
                >
                  Students Support
                </a>
              </li>
            </ul>
          </div>
          <div className="col study-resources">
            <h6>Study Tools and Areas</h6>
            <ul className="study-list">
              <li className="school-list-item">
                <a
                  className="click-button"
                  href="https://www.uta.edu/math/LRC/clinic.php"
                  target="_blank"
                >
                  Math Clinic
                </a>
              </li>
              <li className="school-list-item">
                <a
                  className="click-button"
                  href="http://www.uta.edu/owl/"
                  target="_blank"
                >
                  Writing Center
                </a>
              </li>
              <li className="school-list-item">
                <a
                  className="click-button"
                  href="https://libraries.uta.edu/services/study-spaces"
                  target="_blank"
                >
                  Study Rooms
                </a>
              </li>
              <li className="school-list-item">
                <a
                  className="click-button"
                  href="https://www.uta.edu/student-success/course-assistance/tutoring"
                  target="_blank"
                >
                  Tutoring
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default School;
