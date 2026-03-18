import { collection, addDoc } from "firebase/firestore";
import { db } from "../components/Admin/firebase";
import { useState } from "react";
import { Link } from "react-router-dom";
import Popup from "../components/Admin/Popup";
import rush from "../components/Photos/Rush ODPhi 2022 Fall shirt Design_Final_For Red Outlines.png";
import { useInView } from "react-intersection-observer";

function Contact() {
  const sacraments = ["UNITY", "HONESTY", "INTEGRITY", "LEADERSHIP"];
  const { ref: rushImage, inView: visibleElement } = useInView({
    triggerOnce: true,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    year: "",
    phoneNum: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName) {
      setShowPopup(true);
      setMessage("Enter First & Last name");
      return;
    } else if (!formData.email) {
      setShowPopup(true);
      setMessage("Enter email");
      return;
    } else if (!formData.phoneNum) {
      setShowPopup(true);
      setMessage("Enter Phone Number");
      return;
    } else if (!formData.year) {
      setShowPopup(true);
      setMessage("Enter classification");
      return;
    }

    await addDoc(collection(db, "interests"), {
      name: formData.firstName + " " + formData.lastName,
      email: formData.email,
      year: formData.year,
      phoneNum: formData.phoneNum,
      submittedAt: new Date(),
    });

    setMessage("Successfully Submitted");
    setShowPopup(true);
  };

  return (
    <div className="contact-page">
      <h3>Contact Us</h3>
      <div className="line-separate" />
      <br />
      <div className="contact-info">
        <div className="reach-info">
          <h5>Recruitment & President</h5>
          <div className="line-separate" />
          <div>
            For any question or concerns reach out to our recruitment chair
          </div>
          <div className="reach-email">
            <span>recruitment.tau@omegadeltaphi.org</span>
            <span>president.tau@omegadeltaphi.org</span>
          </div>
          <div>
            Follow our{" "}
            <a href="https://www.instagram.com/tau_knights/">Instagram</a> for
            more
          </div>
        </div>
        <div className="core-values">
          <h5>Our Core Values</h5>
          <div className="line-separate" />
          <br />
          <ul className="core-values-list">
            {sacraments.map((sacrament, index) => (
              <li
                className="values"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                {sacrament}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="interest-form mt-4">
        <img
          ref={rushImage}
          className={`rush-image ${visibleElement ? "rush-effect" : ""}`}
          src={rush}
        />
        <div className="form">
          <h4>Interest Form</h4>
          <div className="interest-full-name">
            <div className="col-form">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                className="interest-name"
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div className="col-form">
              <label htmlFor="last">Last Name</label>
              <input
                type="text"
                name="lastName last"
                id="last"
                value={formData.lastName}
                className="interest-name"
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="col-form">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              className="interest-email"
              onChange={handleChange}
              placeholder="name@email.com"
            />
          </div>
          <div className="year-phone">
            <div className="col-form year">
              <label>Classification</label>
              <select name="year" value={formData.year} onChange={handleChange}>
                <option value="" disabled>
                  Select Year
                </option>
                <option value="transfer">Transfer Student</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <div className="col-form num">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={handleChange}
                placeholder="(123) 456 - 7890"
              />
            </div>
          </div>
          <button className="interest-submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <img
          ref={rushImage}
          className={`rush-image ${visibleElement ? "rush-effect" : ""}`}
          src={rush}
        />
      </div>
      <div className="campus-activity mt-xl-4 mt-2">
        <h4>Check out what we're doing on campus</h4>
        <div className="campus-activity-row">
          <Link to="/Mtb" className="on-campus">
            <span>Who's on campus?</span>
            <span>Bros on campus</span>
          </Link>
          <Link to="/" className="on-campus">
            <span>Events on Campus?</span>
            <span>Check out our events</span>
          </Link>
        </div>
      </div>
      {showPopup && (
        <Popup
          message={message}
          collectionName={""}
          onClose={() => setShowPopup(false)}
          autoClose={true}
          duration={1000}
          showCloseButton={false}
        />
      )}
    </div>
  );
}

export default Contact;
