import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useCollection } from "../utils/auth";
import { LuSwords } from "react-icons/lu";
import { FaChessKnight, FaShield, FaChessKing } from "react-icons/fa6";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import KnightCard from "../components/AboutFolder/KnightCard";
import crown from "../components/Photos/ODP Minimal Crown - Black.png";
import memories from "../components/Photos/memories.jpeg";
import founders from "../components/Photos/founders.jpeg";
import type { Knights } from "../components/EventsFolder/eventData";

type CarouselProps = {
  knights: Knights[];
  hasAwards?: boolean;
};

function Mtb() {
  const { ref: sacramentRef, inView: visible } = useInView({
    triggerOnce: true,
  });
  const { ref: requirementRef, inView: reqVisible } = useInView({
    triggerOnce: true,
    threshold: 0.75,
  });
  const allKnights = useCollection({
    collectionName: "house",
    activeHouse: true,
    onlyPhotos: false,
  }).filter((knight) => knight.type !== "Inactive");
  const recognized = allKnights.filter(
    (knight) => knight.awards && knight.awards.length > 0,
  );
  const POSITION_ORDER = [
    "President",
    "Vice President",
    "Ivp",
    "Secretary",
    "Sergeant At Arms",
    "PME",
    "Treasurer",
  ];

  const sortedKnights = [...allKnights].sort((a: Knights, b: Knights) => {
    const getIndex = (knight: Knights) => {
      if (!knight.positions || knight.positions.length === 0) return Infinity;
      return Math.min(
        ...knight.positions.map((p) => {
          const i = POSITION_ORDER.indexOf(p);
          return i === -1 ? Infinity : i;
        }),
      );
    };

    const aIndex = getIndex(a);
    const bIndex = getIndex(b);

    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });

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
    { label: "UNITY", icon: <LuSwords />, left: "CRESCIT", right: "EUNDO" },
    {
      label: "HONESTY",
      icon: <FaChessKnight />,
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
    "Be a full-time student (12+ Enrolled Credit Hours)",
    "Have a cumulative GPA of +2.5",
    "Not have rushed/pledged another organization",
    "Have been handed a bid by active house",
  ];

  return (
    <>
      <div className="page mtb-page">
        <h1>Meet The Chapter</h1>
        <div
          className="mtb-sacraments flex-col-center w-75 gap-3"
          ref={sacramentRef}
        >
          {sacraments.map(({ label, icon, left, right }, index) => (
            <div
              key={index}
              className={`flex-center card gap-4 ${index % 2 === 0 ? "right" : "left"} ${visible ? "show" : ""}`}
              style={{ "--delay": `${index * 300}ms` } as React.CSSProperties}
            >
              <div className="message flex-grow-1 text-center hide-mobile">
                {left}
              </div>
              <div className="icon flex-center">{icon}</div>
              <div className="label-wrapper flex-grow-1 text-center">
                {label}
              </div>
              <div className="icon reverse flex-center">{icon}</div>
              <div className="message flex-grow-1 text-center hide-mobile">
                {right}
              </div>
            </div>
          ))}
        </div>
        {recognized.length > 0 && (
          <div className="knights-display">
            <h2 className="knights-header">Award Spotlight</h2>
            <KnightCarousel knights={recognized} hasAwards={true} />
          </div>
        )}
        <div className="member-requirements flex-col-center text-center w-75 w-100-mobile">
          <span className="member-requirement-title flex-center w-100">
            Membership Requirements
          </span>
          <ul className="requirement-list flex-col" ref={requirementRef}>
            {requirements.map((requirement, index) => (
              <li
                key={index}
                className={`requirement flex-center card ${index % 2 === 0 ? "right" : "left"} ${reqVisible ? "show" : ""}`}
                style={{ "--delay": `${index * 300}ms` } as React.CSSProperties}
              >
                {requirement}
              </li>
            ))}
          </ul>
          <span className="member-requirement-bottom flex-center w-100" />
        </div>
        <div className="display flex-col-center w-100">
          <h2>Active House</h2>
          <KnightCarousel knights={sortedKnights} />
        </div>
        <div className="line-separate" />
        <div className="hist-container flex-col flex-even w-75">
          <div className="founding-lines flex flex-col-mobile flex-even w-100">
            <div className="flex-col-center w-50 w-100-mobile h-100">
              <div className="hist-header">
                <img className="crown" src={crown} alt="Crown" />
                <div>Founders</div>
              </div>
              <ul className="flex-col-center flex-around w-100 h-100 gap-3 p-0">
                {foundingMembers.map((founder, index) => (
                  <li
                    key={index}
                    className="member-name flex-center flex-grow-1 w-100"
                  >
                    <div className="handle-left" />
                    {founder}
                    <div className="handle-right" />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-col-center w-50 w-100-mobile h-100">
              <div className="hist-header text-center">
                <img className="crown" src={crown} alt="Crown" />
                <div>Charter Class</div>
              </div>
              <ul className="flex-col-center flex-around w-100 h-100 gap-3 p-0">
                {charterMembers.map((charter, index) => (
                  <li
                    key={index}
                    className="member-name flex-center flex-grow-1 w-100"
                  >
                    <div className="handle-left" />
                    {charter}
                    <div className="handle-right" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tau-hist-container flex-center row w-100 gap-3">
            <h3 className="w-100 text-center">Tau Chapter History</h3>
            <img
              className="col img-fluid memories ms-3 p-3 card"
              src={memories}
            />
            <div className="col flex-col-center w-75">
              <div className="w-100 gap-3">
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
          <div className="tau-hist-container flex-center row w-100 gap-3">
            <h3 className="w-100 text-center">Our Mission Statement</h3>
            <div className="col w-100 gap-3">
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
              className="col img-fluid memories me-3 card hide-mobile"
              src={founders}
              alt="Founder"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function KnightCarousel({ knights, hasAwards = false }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? knights.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === knights.length - 1 ? 0 : prev + 1));

  const getCardClass = (index: number) => {
    const diff = index - currentIndex;
    if (diff === 0) return "carousel-card pos-absolute active";
    if (diff === -1 || (currentIndex === 0 && index === knights.length - 1))
      return "carousel-card pos-absolute side left";
    if (diff === 1 || (currentIndex === knights.length - 1 && index === 0))
      return "carousel-card pos-absolute side right";
    return "carousel-card pos-absolute hidden";
  };

  return (
    <div className="knights-carousel flex-col-center pos-relative">
      <div className="carousel-buttons flex-center flex-between pos-absolute w-100 h-50">
        <button className="carousel-btn flex-center p-0" onClick={handlePrev}>
          <FaChevronLeft />
        </button>
        <button className="carousel-btn flex-center p-0" onClick={handleNext}>
          <FaChevronRight />
        </button>
      </div>
      <div className="carousel-track flex-center pos-relative w-100">
        {knights.map((knight, index) => (
          <div key={knight.id} className={getCardClass(index)}>
            <KnightCard knight={knight} index={index} hasAwards={hasAwards} />
          </div>
        ))}
      </div>
      <div className="flex-center mt-3 gap-2">
        {knights.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default Mtb;
