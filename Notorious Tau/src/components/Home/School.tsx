import { Fragment } from "react/jsx-runtime";
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
    <Fragment>
      <div ref={myRef} className={blaze}>
        <h1>UTA Resources</h1>
        <div className="row" id="resources-row">
          <div className="col" id="help-resources">
            <h6>Student Help</h6>
            <ul id="help-list">
              <li className="school-list-item">
                Counseling
                <br />
                <a
                  className="click-button"
                  href="https://www.uta.edu/student-affairs/caps"
                  target="_blank"
                >
                  Click Me
                </a>
              </li>
              <li className="school-list-item">
                Health Services
                <br />
                <a
                  className="click-button"
                  href="http://www.uta.edu/healthservices/"
                  target="_blank"
                >
                  Click Me
                </a>
              </li>
              <li className="school-list-item">
                Student Support
                <br />
                <a
                  className="click-button"
                  href="https://www.uta.edu/student-affairs/student-support"
                  target="_blank"
                >
                  Click Me
                </a>
              </li>
            </ul>
          </div>
          <div className="col" id="study-resources">
            <h6>Study Tools and Areas</h6>
            <ul id="study-list">
              <li className="school-list-item">
                Math Clinic
                <br />
                <a
                  className="click-button"
                  href="https://www.uta.edu/math/LRC/clinic.php"
                  target="_blank"
                >
                  Click Me
                </a>
              </li>
              <li className="school-list-item">
                Writing Center
                <br />
                <a
                  className="click-button"
                  href="http://www.uta.edu/owl/"
                  target="_blank"
                >
                  Click Me
                </a>
              </li>
              <li className="school-list-item">
                Study Rooms
                <br />
                <a
                  className="click-button"
                  href="https://libraries.uta.edu/services/study-spaces"
                  target="_blank"
                >
                  Click Me
                </a>
              </li>
              <li className="school-list-item">
                Tutoring
                <br />
                <a
                  className="click-button"
                  href="https://www.uta.edu/student-success/course-assistance/tutoring"
                  target="_blank"
                >
                  Click Me
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default School;
