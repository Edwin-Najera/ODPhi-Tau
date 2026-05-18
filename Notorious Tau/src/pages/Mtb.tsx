import { Fragment } from "react";
import { useInView } from "react-intersection-observer";
import { useCollection } from "../utils/auth";
import {
  FaHandshake,
  FaScaleUnbalanced,
  FaShield,
  FaChessKing,
} from "react-icons/fa6";
import KnightCard from "../components/AboutFolder/KnightCard";
import crown from "../components/Photos/ODP Minimal Crown - Black.png";
import memories from "../components/Photos/memories.jpeg";
import founders from "../components/Photos/founders.jpeg";

function Mtb() {
  const { ref: sacramentRef, inView: visible } = useInView({
    triggerOnce: true,
  });
  const { ref: requirementRef, inView: reqVisible } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const allKnights = useCollection({
    collectionName: "house",
    activeHouse: true,
    onlyPhotos: false,
  });
  const executives = allKnights.filter((knight) => knight.type === "executive");
  const actives = allKnights.filter((knight) => knight.type === "active");
  const recognized = allKnights.filter(
    (knight) => knight.awards && knight.awards.length > 0,
  );
  const foundingMembers = [
    "William Macklin",
    "Micheal Vega",
    "Fernando Valenciana",
    "Arturo Elizondo",
    "Humberto Carbajal",
    "Abel Malagon",
    "Washington Cabrera",
    "Fredy Ferman",
    "Alexander Cecenas",
    "Steven Smith",
  ];
  const charterMembers = [
    "Ricky Esqueda",
    "Paul Hernandez",
    "Marc Solis",
    "Keron Fritz",
    "Javier Casterllon",
    "Carlos Diaz",
    "Detric Kelly",
    "Jimmy Change",
    "Micheal Chang",
    "Joseph Munguia",
    "Manuel Rojas",
    "Brandon Smith",
  ];

  const sacraments = [
    { label: "UNITY", icon: <FaHandshake />, left: "CRESCIT", right: "EUNDO" },
    {
      label: "HONESTY",
      icon: <FaScaleUnbalanced />,
      left: '"It Grows',
      right: 'As It Goes"',
    },
    {
      label: "INTEGRITY",
      icon: <FaShield />,
      left: "One",
      right: "Culture",
    },
    {
      label: "LEADERSHIP",
      icon: <FaChessKing />,
      left: "Any",
      right: "Race",
    },
  ];

  const requirements = [
    "Be a full-time student",
    "Have a cumulative GPA of +2.5",
    "Not have rushed/pledged another organization",
    "Have been handed a big by active house",
  ];

  return (
    <>
      <div className="page mtb-page">
        <h1>Meet The Chapter</h1>
        <div className="mtb-sacraments" ref={sacramentRef}>
          {sacraments.map(({ label, icon, left, right }, index) => (
            <div
              key={index}
              className={`card ${index % 2 === 0 ? "right" : "left"} ${visible ? "show" : ""}`}
              style={{ "--delay": `${index * 300}ms` } as React.CSSProperties}
            >
              <div className="message">{left}</div>
              <div className="icon">{icon}</div>
              <div className="label-wrapper">{label}</div>
              <div className="icon reverse">{icon}</div>
              <div className="message">{right}</div>
            </div>
          ))}
        </div>
        <div className="member-requirements">
          <span className="member-requirement-title">
            Membership Requirements
          </span>
          <ul className="requirement-list" ref={requirementRef}>
            {requirements.map((requirement, index) => (
              <li
                key={index}
                className={`requirement card ${index % 2 === 0 ? "right" : "left"} ${reqVisible ? "show" : ""}`}
                style={{ "--delay": `${index * 300}ms` } as React.CSSProperties}
              >
                {requirement}
              </li>
            ))}
          </ul>
          <span className="member-requirement-bottom" />
        </div>
        {recognized.length > 0 && (
          <div className="recognition">
            <h5>Spotlight</h5>
            {recognized.map((knight, index) => (
              <KnightCard knight={knight} index={index} hasAwards={true} />
            ))}
          </div>
        )}
        <h3 className="knights-header">Active House</h3>
        <div className="mtb-active-house">
          <h3 className="mtb-knights-header">Executives</h3>
          <div className="mtb-knights-container">
            {executives.map((knight, index) => (
              <Fragment key={knight.id}>
                <KnightCard knight={knight} index={index} />
              </Fragment>
            ))}
          </div>
        </div>
        <div className="line-separate" />
        <div className="mtb-active-house">
          <div className="mtb-knights-container">
            {actives.map((knight, index) => (
              <Fragment key={knight.id}>
                <KnightCard knight={knight} index={index} />
              </Fragment>
            ))}
          </div>
        </div>
        <div className="line-separate" />
        <div className="history-container">
          <div className="founding-lines">
            <div className="founders-container">
              <div className="history-header">
                <img className="crown" src={crown} alt="Crown" />
                <div>Founders</div>
              </div>
              <ul className="founders-list">
                {foundingMembers.map((founder, index) => (
                  <li key={index} className="member-name">
                    <div className="handle-left" />
                    {founder}
                    <div className="handle-right" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="charter-container">
              <div className="history-header">
                <img className="crown" src={crown} alt="Crown" />
                <div>Charter Class</div>
              </div>
              <ul className="charter-list">
                {charterMembers.map((charter, index) => (
                  <li key={index} className="member-name">
                    <div className="handle-left" />
                    {charter}
                    <div className="handle-right" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tau-history-container row">
            <h3 className="row">Tau Chapter History</h3>
            <img
              className="col img-fluid memories ms-3 p-3 card"
              src={memories}
            />
            <div className="col text-col">
              <div className="tau-history">
                <p>
                  The Tau Chapter of Omega Delta Phi Fraternity, Inc. was
                  established at the University of Texas at Arlington to
                  continue the fraternity’s mission of promoting unity,
                  leadership, academic excellence, and community service.
                  Founded nationally on November 25, 1987, at Texas Tech
                  University, Omega Delta Phi was created to provide a
                  brotherhood that celebrates diversity while developing leaders
                  committed to serving their communities.
                </p>
                <p>
                  Since its establishment, the Tau Chapter has worked to uphold
                  these founding principles on the UTA campus. The chapter has
                  contributed to the growth of multicultural Greek life by
                  creating opportunities for students to build meaningful
                  connections, develop leadership skills, and give back through
                  service initiatives.
                </p>
                <p>
                  Throughout its history, the Tau Chapter has remained committed
                  to fostering strong brotherhood while making a positive impact
                  both on campus and in the surrounding Arlington community.
                  Through philanthropy events, campus involvement, & alumni
                  support, the chapter continues to build upon the legacy of
                  Omega Delta Phi and shape future leaders.
                </p>
              </div>
            </div>
          </div>
          <div className="tau-history-container row">
            <h3 className="row">Our Mission Statement</h3>
            <div className="purpose col">
              <p>
                The purpose of this brotherhood, a{" "}
                <strong>Service/Social</strong> fraternity dedicated to the
                needs and concerns of the community, shall be to promote &
                maintain the traditional values of unity, honesty, integrity &
                leadership. This brotherhood was founded in order to provide to{" "}
                <strong>ANY man</strong> a diverse fraternal experience which
                coincides with a higher education.
              </p>
              <div className="card">
                <p className="card-body">
                  Our <strong>Seven Founders</strong> sought to make change
                  through the fraternity. Regardless of background, Omega Delta
                  Phi welcomes all. Founded on{" "}
                  <strong>November 25th, 1987</strong> at Texas Tech University,
                  what began as a single idea on one campus has grown into a
                  national brotherhood that continues to shape leaders,
                  strengthen communities, and provide every man a home away from
                  home.
                </p>
              </div>
            </div>
            <img
              className="col img-fluid memories me-3 card"
              src={founders}
              alt="Founder"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Mtb;
