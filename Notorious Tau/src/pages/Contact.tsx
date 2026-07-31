import { useState } from "react";
import Popup from "../components/Admin/PopupFolder/Popup";
import rush from "../components/Photos/Rush ODPhi 2022 Fall shirt Design_Final_For Red Outlines.png";
import { useInView } from "react-intersection-observer";
import { showMessage, formatPhone } from "../utils/handle";

function Contact() {
  const sacraments = ["UNITY", "HONESTY", "INTEGRITY", "LEADERSHIP"];
  const { ref: rushImage, inView: visibleElement } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "save" | "active" | null;
  }>({ show: false, message: "", type: null });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    year: "",
    instagram: "",
    phoneNum: "",
  });
  const freqQuestions = [
    {
      question: "Where does recruitment take place?",
      answer:
        "Recruitment changes every semester - keep an eye on our main page or on our Instagram @tau_knights for the latest updates.",
      elementId: "first",
    },
    {
      question: "Is there a GPA requirement?",
      answer:
        'With "Graduating Our Brothers" being one of our goals, we strive to be excellent in all fields. Omega Delta Phi looks for individuals that have a cumulative GPA of +2.5.',
      elementId: "second",
    },
    {
      question: 'What does "One Culture, Any Race" mean?',
      answer:
        "Omega Delta Phi was founded on the belief that brotherhood has no racial boundaries. We welcome ANY man regardless of background, ethnicity, or culture. We celebrate diversity and believe that our differences make our brotherhood stronger.",
      elementId: "third",
    },
    {
      question: "Where do I sign up for recruitment?",
      answer:
        "You can fill out the interest form located above. Our recruitment chair will reach out to you regarding more information.",
      elementId: "fourth",
    },
    {
      question: "What can I gain from Omega Delta Phi?",
      answer:
        "Not only a brotherhood that will last a lifetime but lifelong skills, a vast network of alumni, leadership experience, community service opportunities, and the personal growth that comes with being held to a higher standard",
      elementId: "fifth",
    },
  ];

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
      showMessage("Enter First & Last Name", "save", setPopup);
      return;
    } else if (!formData.email) {
      showMessage("Enter Email", "save", setPopup);
      return;
    } else if (!formData.phoneNum) {
      showMessage("Enter Phone Number", "save", setPopup);
      return;
    } else if (!formData.year) {
      showMessage("Enter classification", "save", setPopup);
      return;
    }

    try {
      await fetch(import.meta.env.VITE_FIREBASE_APPSCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          ...formData,
          formType: "interest",
          token: import.meta.env.VITE_FIREBASE_SECRET_TOKEN,
        }),
      });
      showMessage("Submitted successfully", "save", setPopup);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        year: "",
        instagram: "",
        phoneNum: "",
      });
    } catch (error) {
      console.error(error);
      showMessage("Unable to submit. Try again Later", "save", setPopup);
    }
  };

  return (
    <div className="page contact-page">
      <h3>Contact Us</h3>
      <div className="line-separate mb-3" />
      <div className="contact-info flex flex-col-mobile">
        <div className="reach-info">
          <h5>Recruitment & President</h5>
          <div className="line-separate" />
          <div>
            For any question or concerns reach out to our recruitment chair
          </div>
          <div className="reach-email flex-col">
            <span>recruitment.tau@omegadeltaphi.org</span>
            <span>president.tau@omegadeltaphi.org</span>
          </div>
          <div>
            Follow our{" "}
            <a
              href="https://www.instagram.com/tau_knights/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>{" "}
            for more
          </div>
        </div>
        <div className="core-values flex-col">
          <h5>Our Core Values</h5>
          <div className="line-separate mb-4" />
          <ul className="core-values-list flex-col">
            {sacraments.map((sacrament, index) => (
              <li
                key={sacrament}
                className="values"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                {sacrament}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="interest-form mt-4 flex-center flex-col-mobile">
        <img
          ref={rushImage}
          className={`rush-image hide-mobile ${visibleElement ? "rush-effect" : ""}`}
          src={rush}
        />
        <div className="form flex-col">
          <h4>Interest Form</h4>
          <div className="flex flex-col-mobile flex-between w-100 gap-3">
            <div className="flex-col w-100">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div className="flex-col w-100">
              <label htmlFor="last">Last Name</label>
              <input
                type="text"
                name="lastName"
                id="last"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="flex-col w-100">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@email.com"
            />
          </div>
          <div className="flex flex-col-mobile flex-between w-100 gap-3">
            <div className="flex-col w-100">
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
            <div className="flex-col w-100">
              <label>Instagram</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                placeholder="@tau_knights"
                onChange={handleChange}
              />
            </div>
            <div className="flex-col w-100">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNum"
                value={formData.phoneNum}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phoneNum: formatPhone(e.target.value),
                  })
                }
                placeholder="(123) 456 - 7890"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              />
            </div>
          </div>
          <button className="interest-submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <img
          ref={rushImage}
          className={`rush-image hide-mobile ${visibleElement ? "rush-effect" : ""}`}
          src={rush}
        />
      </div>
      <div className="faq flex-col-center w-100 mt-5">
        <h2>Frequently Asked Questions</h2>
        <div className="line-separate" />
        <div className="accordion accordion-flush mt-3" id="faq-accordion">
          {freqQuestions.map(({ question, answer, elementId }, index) => (
            <div key={index} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${elementId}`}
                  aria-expanded="false"
                  aria-controls={elementId}
                >
                  {question}
                </button>
              </h2>
              <div
                className="accordion-collapse collapse"
                data-bs-parent="#faq-accordion"
                id={elementId}
              >
                <div className="accordion-body">{answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {popup.show && (
        <Popup
          message={popup.message}
          onClose={() => setPopup({ show: false, message: "", type: null })}
          duration={1000}
        />
      )}
    </div>
  );
}

export default Contact;
