import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewLearningPlans from './components/ViewLearningPlans';
import CreateLearningPlan from './components/CreateLearningPlan';


function App() {
  return (
    <Router>
      <div>
        <h1>MasterMind App</h1>
        <Routes>
          <Route path="/all_learning_plans" element={<ViewLearningPlans />} />
          {/* ViewLearningPlans*/}
          <Route path="/create_learning_plan" element={<CreateLearningPlan />} />
          {/* CreateLearningPlan */}
        </Routes>
      </div>
    </Router>

  );
}

export default App;
