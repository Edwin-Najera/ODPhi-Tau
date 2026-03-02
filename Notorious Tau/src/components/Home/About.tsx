import tau from "../Photos/T.png";

function About() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      id="about-container"
    >
      <img src={tau} alt="Group Photo" className="me-4 group-photo" />
      <p id="about-description">
        Welcome to the offical website of The Notorious Tau Chapter of Omega
        Delta Phi fraternity Inc. (ΩΔΦ)
        <br /> <br />
        The Notorious Tau is a service and social fraternity dedicated building
        strong leaders and meaningful connections. Here at Tau, the brotherhood
        will strive to shape and make you the best you can be. Whether it be
        academically, personally, or professionally, this brotherhood will
        challenge you to grow while giving back to the community. As in our
        motto <strong>"One culture, Any Race"</strong> we celebrate every
        triumph, and we foster brotherhood that lives on for a lifetime.
        <br /> <br />
        Explore the website and discover how being a Knight has transformed the
        brothers
      </p>
    </div>
  );
}

export default About;
