import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Events from "./components/Events";
import School from "./components/School";
import Footer from "./components/Footer";

function App() {
  return (
    <div id="AppGrid">
      <Navbar />

      <div id="Welcome">
        <HomePage />
      </div>
      <div id="gap">
        <div className="chevron" />
      </div>
      <div id="Events">
        <Events />
      </div>

      <div id="World"></div>
      <div id="School">
        <School />
      </div>
      <div id="MGC"></div>
      <div id="Contact"></div>
      <div id="Footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
