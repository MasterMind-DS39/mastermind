import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewLearningPlans from './components/ViewLearningPlans';
import CreateLearningPlan from './components/CreateLearningPlan';
import PlanDetails from './components/PlanDetails';
import ViewUserPlans from './components/ViewUserPlans';
import CompletedPlans from './components/CompletedPlans';
import OngoingPlans from './components/OngoingPlans';
import Sidebar from './components/SideBar';


function App() {
  const contentStyle = {
    marginLeft: "220px",
    padding: "20px",
    backgroundColor: "#f0f2f5", // Facebook light gray
    minHeight: "100vh",
  };
  return (
    <Router>
      <div>
        
        <Sidebar />

        <div  style={contentStyle}>
        <h1>MasterMind App</h1>

        <Routes>
          <Route path="/all_learning_plans" element={<ViewLearningPlans />} />
          {/* ViewLearningPlans*/}
          <Route path="/create_learning_plan" element={<CreateLearningPlan />} />
          {/* CreateLearningPlan */}
          <Route path='/plans/:planId' element={<PlanDetails />} />
          {/* PlanDetails */}
          <Route path='/user/:userId' element={<ViewUserPlans />} />
          {/* ViewUserPlans */}
          <Route path='/completed_plans' element={<CompletedPlans />} />
          {/* ViewCompletedPlans */}
          <Route path="/ongoing-plans" element={<OngoingPlans />} />
          {/* OngoingPlans */}
        </Routes>


        </div>

        
      </div>
    </Router>

  );
}

export default App;
