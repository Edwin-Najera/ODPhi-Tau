import { useState, useEffect, Fragment } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { Knights } from "../components/EventsFolder/eventData";
import Loading from "../components/Loading";
import KnightCards from "../components/AboutFolder/Knights";
import crown from "../components/Photos/ODP Minimal Crown - Black.png";

function Mtb() {
  const [actives, setActives] = useState<Knights[]>([]);
  const [executives, setExecutives] = useState<Knights[]>([]);
  const [recognized, setRecognized] = useState<Knights[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const q = query(collection(db, "house"), orderBy("lineNumber", "asc"));

        const snapshot = await getDocs(q);

        const actives: Knights[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Knights, "id">),
        }));

        actives.forEach((knight) => {
          const splitName = knight.name.split(" ");
          const greekName = [
            ...splitName.slice(0, 1),
            `"${knight.knightName}"`,
            ...splitName.slice(1),
          ];
          const joinedName = greekName.join(" ");

          knight.name = joinedName;
        });

        const activeGallery = actives.filter(
          (knight) => knight.type === "active",
        );
        const executiveGallery = actives.filter(
          (knight) => knight.type === "executive",
        );
        const awardedBros = actives.filter(
          (knight) => knight.awards && knight.awards.length > 0,
        );

        console.log(awardedBros);
        setRecognized(awardedBros);
        setActives(activeGallery);
        setExecutives(executiveGallery);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  if (loading) return <Loading />;

  return (
    <Fragment>
      <div className="mtb-page">
        <h1>Meet The Chapter</h1>
        <div className="member-requirements">
          <span className="member-requirement-title">
            Membership Requirements
          </span>
          <ul className="requirement-list">
            <li className="requirement">Be a full-time student</li>
            <li className="requirement">Have a cumulative GPA of +2.5</li>
            <li className="requirement">
              Not have rushed/pledged another organization
            </li>
            <li className="requirement">
              Have been handed a big by active house
            </li>
          </ul>
          <span className="member-requirement-bottom" />
        </div>
        {recognized.length > 0 && (
          <div className="recognition">
            <h5>Awarded Bros</h5>
            {recognized.map((knight, index) => (
              <KnightCards knight={knight} index={index} hasAwards={true} />
            ))}
          </div>
        )}
        <h3 className="knights-header">Meet the Bros</h3>
        <div className="mtb-active-house">
          <h3 className="mtb-knights-header">Executives</h3>
          <div className="mtb-knights-container">
            {executives.map((knight, index) => (
              <Fragment key={knight.id}>
                <KnightCards knight={knight} index={index} />
              </Fragment>
            ))}
          </div>
        </div>
        <div className="line-separate" />
        <div className="mtb-active-house">
          <div className="mtb-knights-container">
            {actives.map((knight, index) => (
              <Fragment key={knight.id}>
                <KnightCards knight={knight} index={index} />
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
          <div className="tau-history-container">
            <h3>Tau Chapter History</h3>
            <p className="tau-history">
              The Tau Chapter of Omega Delta Phi Fraternity, Inc. was
              established at the University of Texas at Arlington to continue
              the fraternity’s mission of promoting unity, leadership, academic
              excellence, and community service. Founded nationally on November
              25, 1987, at Texas Tech University, Omega Delta Phi was created to
              provide a brotherhood that celebrates diversity while developing
              leaders committed to serving their communities.
              <br />
              <br />
              Since its establishment, the Tau Chapter has worked to uphold
              these founding principles on the UTA campus. The chapter has
              contributed to the growth of multicultural Greek life by creating
              opportunities for students to build meaningful connections,
              develop leadership skills, and give back through service
              initiatives.
              <br />
              <br />
              Throughout its history, the Tau Chapter has remained committed to
              fostering strong brotherhood while making a positive impact both
              on campus and in the surrounding Arlington community. Through
              philanthropy events, campus involvement, & alumni support, the
              chapter continues to build upon the legacy of Omega Delta Phi and
              shape future leaders.
            </p>
          </div>
          <div className="mission-container">
            <h3>Purpose of Omega Delta Phi</h3>
            <p className="purpose">
              The purpose of this brotherhood, a <strong>Service/Social</strong>{" "}
              fraternity dedicated to the needs and concerns of the community,
              shall be to prmote & maintain the traditional values of unity,
              honesty, integrity & leadership, this brotherhood was founded in
              order to provide to <strong>ANY man</strong> a diverse fraternal
              experience which conincides with a higher education.
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Mtb;
