import { Fragment } from "react/jsx-runtime";
import "./global.css";

function School() {
  return (
    <Fragment>
      <div className="schoolContainer">
        <h3>UTA Resources</h3>
        <div className="row" id="resourcesRow">
          <div className="col" id="helpResources">
            <h6>Student Help Resources</h6>
            <ul id="helpList">
              <li>
                Counseling
                <br />
                <a
                  className="clickButton"
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
                  className="clickButton"
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
                  className="clickButton"
                  href="https://www.uta.edu/student-affairs/student-support"
                  target="_blank"
                >
                  Click Me
                </a>
              </li>
            </ul>
          </div>
          <div className="col" id="studyResources">
            <h6>Study Tools and Areas</h6>
            <ul id="studyList">
              <li>
                Math Clinic
                <br />
                <a
                  className="clickButton"
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
                  className="clickButton"
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
                  className="clickButton"
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
                  className="clickButton"
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
