// components/ViewCompletedPlans.js
import React from 'react';
import PlanList from './PlanList';

function ViewCompletedPlans() {
  const userId = 1; // Hardcoded for now
  return (
    <PlanList
      title="Completed Learning Plans"
      endpoint={`http://localhost:8080/api/plans/user/${userId}/completed`}
      showActions={false}
    />
  );
}

export default ViewCompletedPlans;