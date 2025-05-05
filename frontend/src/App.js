import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewLearningPlans from './components/ViewLearningPlans';
import CreateLearningPlan from './components/CreateLearningPlan';
import PlanDetails from './components/PlanDetails';
import ViewUserPlans from './components/ViewUserPlans';
import CompletedPlans from './components/CompletedPlans';
import OngoingPlans from './components/OngoingPlans';


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
          <Route path='/plans/:id' element={<PlanDetails />} />
          {/* PlanDetails */}
          <Route path='/user/:userId' element={<ViewUserPlans />} />
          {/* ViewUserPlans */}
          <Route path='/completed_plans' element={<CompletedPlans />} />
          {/* ViewCompletedPlans */}
          <Route path="/ongoing-plans" element={<OngoingPlans />} />
          {/* OngoingPlans */}
        </Routes>
      </div>
    </Router>

  );
}

export default App;
