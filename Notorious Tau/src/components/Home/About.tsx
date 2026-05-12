import tau from "../Photos/Group.jpeg";

function About() {
  return (
    <div className="d-flex justify-content-center align-items-center about-container">
      <img src={tau} alt="Group Photo" className="me-xl-5 group-photo" />
      <div className="about-description">
        <p>
          Welcome to the official website of The Notorious Tau Chapter of Omega
          Delta Phi fraternity Inc. (ΩΔΦ)
        </p>
        <p>
          The Notorious Tau is a service and social fraternity dedicated
          building strong leaders and meaningful connections. Here at Tau, the
          brotherhood will strive to shape and make you the best you can be.
          Whether it be academically, personally, or professionally, this
          brotherhood will challenge you to grow while giving back to the
          community. As in our motto <strong>"One culture, Any Race"</strong> we
          celebrate every triumph, and we foster brotherhood that lives on for a
          lifetime.
        </p>
        <p>
          Explore the website and discover how being a Knight has transformed
          the brothers
        </p>
      </div>
    </div>
  );
}

export default About;
