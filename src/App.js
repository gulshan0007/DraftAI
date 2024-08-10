import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Template1 from './components/Template1';
import Template2 from './components/Template2';
import Template3 from './components/Template3';
// import Template4 from './components/Template4';

const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/template1"><button>Go to Template 1</button></Link>
      <Link to="/template2"><button>Go to Template 2</button></Link>
      <Link to="/template3"><button>Go to Template 3</button></Link>
      {/* <Link to="/template4"><button>Go to Template 4</button></Link> */}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template1" element={<Template1 filePath="1.docx"/>} />
        <Route path="/template2" element={<Template2 filePath="2.docx" />} />
        <Route path="/template3" element={<Template3 filePath="3.docx"/>} />
        {/* <Route path="/template4" element={<Template4 filePath="1.docx"/>} /> */}
      </Routes>
    </Router>
  );
};

export default App;
