import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { AddContract } from "./pages/AddContract";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddContract />} />
     
      </Routes>
    </Router>
  );
  
    
  
}

export default App;


// export default function App() {
//   return (
//     <div style={{ padding: '20px', border: '2px solid blue' }}>
//       <Dashboard />
//     </div>
//   );
// }

// export default function App() {
//   return <h1 style={{ color: 'red' }}>TEST (React is working!)</h1>;
// }