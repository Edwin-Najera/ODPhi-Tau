import "./App.css";
import { Fragment } from "react/jsx-runtime";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Footer from "./components/Footer";

function App() {
  return (
    <Fragment>
      <div id="AppGrid">
        <Navbar />

        <div id="Welcome">
          <HomePage />
        </div>
        <div id="gap">
          <div className="chevron" />
        </div>
        <div id="Events"> </div>
        <div id="World"></div>
        <div id="School"></div>
        <div id="MGC"></div>
        <div id="Contact"></div>
        <div id="Footer">
          <Footer />
        </div>
      </div>
    </Fragment>
  );
}

export default App;
