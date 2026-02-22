import { Fragment } from "react/jsx-runtime";
import "./global.css";

function School() {
  return (
    <Fragment>
      <div className="school-container">
        <h3>UTA Resources</h3>
        <div className="row" id="resources-row">
          <div className="col" id="help-resources">
            <h6>Student Help Resources</h6>
            <ul id="help-list">
              <li>
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
              <li>
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
              <li>
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
              <li>
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
              <li>
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
              <li>
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
              <li>
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
