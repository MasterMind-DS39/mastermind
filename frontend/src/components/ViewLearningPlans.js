// components/ViewAllPlans.js
import React from 'react';
import PlanList from './PlanList';

function ViewAllPlans() {
  return (
    <PlanList title="All Learning Plans" endpoint="http://localhost:8080/api/plans" />
  );
}

export default ViewAllPlans;