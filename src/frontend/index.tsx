
import { createRoot } from 'react-dom/client';
import Gallery from './Gallery/index';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Admin from './Admin';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <div style={{ display: "flex", height: "100%", width: "100%", backgroundColor: "#e0efef",  justifyContent:"center" }}>
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Gallery />} />
      </Routes>
    </Router>
  </div>
);