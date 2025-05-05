import React, { useEffect, useState } from 'react';
import LessonList from './LessonList';
import LessonProgress from './LessonProgress';

function PlanDetails({ planId }) {
  const [plan, setPlan] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/plans/${planId}`)
      .then((res) => res.json())
      .then((data) => setPlan(data));
  }, [planId]);

  if (!plan) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{plan.title}</h2>
      <p>{plan.description}</p>

      {!started ? (
        <button onClick={() => setStarted(true)}>Start Learning Plan</button>
      ) : (
        <>
          <LessonProgress lessons={plan.lessons} />
          <LessonList lessons={plan.lessons} />
        </>
      )}
    </div>
  );
}

export default PlanDetails;
