import { useState, useEffect, Fragment } from "react";
import { db } from "../components/Admin/firebase";
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

        const activeGallery = actives.filter((knight) =>
          knight.id.startsWith("active_"),
        );
        const executiveGallery = actives.filter((knight) =>
          knight.id.startsWith("executive_"),
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
        <div className="history-container">
          <div className="founders-container">
            <div className="history-header">
              <img src={crown} alt="Crown" />
              <div>Founders</div>
            </div>
            <ul className="founders-list">
              <li className="founder-name">William Macklin</li>
              <li className="founder-name">Micheal Vega</li>
              <li className="founder-name">Fernando Valenciana</li>
              <li className="founder-name">Arturo Elizondo</li>
              <li className="founder-name">Humberto Carbajal</li>
              <li className="founder-name">Abel Malagon</li>
              <li className="founder-name">Washington Cabrera</li>
              <li className="founder-name">Fredy Ferman</li>
              <li className="founder-name">Alexander Cencenas</li>
              <li className="founder-name">Steven Smith</li>
            </ul>
          </div>
          <div className="charter-container">
            <ul className="charter-list">
              <li className="charter-member">Ricky Esqueda</li>
              <li className="charter-member">Paul Hernandez</li>
              <li className="charter-member">Marc Solis</li>
              <li className="charter-member">Keron Fritz</li>
              <li className="charter-member">Javier Casterllon</li>
              <li className="charter-member">Carlos Diaz</li>
              <li className="charter-member">Detric Kely</li>
              <li className="charter-member">Jimmy Chang</li>
              <li className="charter-member">Micheal Chang</li>
              <li className="charter-member">Joseph Munguia</li>
              <li className="charter-member">Manuel Rojas</li>
              <li className="charter-member">Brandon Smith</li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Mtb;
