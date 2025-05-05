// components/ViewUserPlans.js
import React from 'react';
import PlanList from './PlanList';

function ViewUserPlans() {
  const userId = 1; // Hardcoded for now
  return (
    <PlanList
      title="My Learning Plans"
      endpoint={`http://localhost:8080/api/plans/user/${userId}`}
      showActions={true}
    />
  );
}

export default ViewUserPlans;