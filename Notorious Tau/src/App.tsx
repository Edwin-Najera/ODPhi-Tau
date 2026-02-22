import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Events from "./components/Events";
import About from "./components/About";
import School from "./components/School";
import Footer from "./components/Footer";
import fundraiser from "./components/Photos/ConchasFund.jpeg";

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
        <Events
          image={fundraiser}
          title="Conchas con Cafe"
          description="Too cold and need something to warm you up? 🔥 Stop by on
                Tuesday, February 24, and treat yourself to a concha (or two😏)
                with some delicious Abuelita hot chocolate☕️! The Notorious Tau
                Chapter of Omega Delta Phi will be at the UC Mall from 11 AM to
                2 PM. We hope to see you there and as always, stay hype! 🔥"
          items={[
            { name: "Conchas", price: "$3.00" },
            { name: "Abuelita Hot Chocolate", price: "$4.00" },
            {
              name: "Combo \n Conchas & Abuelita Hot Chocolate",
              price: "$6.00",
            },
          ]}
        />
      </div>

      <div id="About">
        <About />
      </div>
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
