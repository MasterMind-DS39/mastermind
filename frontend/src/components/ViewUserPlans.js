// components/ViewUserPlans.js
import React from 'react';
import PlanList from './PlanList';

function ViewUserPlans() {
  const userId = 1; // You can later get this from auth context or props
  return (
    <PlanList title="My Learning Plans" endpoint={`http://localhost:8080/api/plans/user/${userId}`} />
  );
}

export default ViewUserPlans;