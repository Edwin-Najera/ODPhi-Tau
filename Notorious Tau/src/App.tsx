import "./App.css";
import { Fragment } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Mtb from "./pages/mtb";
import Gallery from "./pages/Gallery";
import Onlybros from "./pages/Onlybros";
import Contact from "./pages/Contact";

function App() {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Mtb" element={<Mtb />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Onlybros" element={<Onlybros />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </Fragment>
  );
}

export default App;
