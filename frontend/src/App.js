import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewLearningPlans from './components/ViewLearningPlans';


function App() {
  return (
    <Router>
      <div>
        <h1>MasterMind App</h1>
        <Routes>
          <Route path="/all_learning_plans" element={<ViewLearningPlans />} />
          {/* ViewLearningPlans*/}
        </Routes>
      </div>
    </Router>

  );
}

export default App;
