// components/PlanList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PlanList({ title, endpoint }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get(endpoint)
      .then(response => setPlans(response.data))
      .catch(error => console.error('Error fetching plans:', error));
  }, [endpoint]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2 style={{ color: '#1877f2' }}>{title}</h2>
      {plans.length === 0 ? (
        <p>No learning plans available.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {plans.map(plan => (
            <li key={plan.id} style={{
              backgroundColor: '#f0f2f5',
              margin: '10px 0',
              padding: '15px',
              borderRadius: '5px'
            }}>
              <Link
                to={`/plans/${plan.id}`}
                style={{
                  fontSize: '18px',
                  textDecoration: 'none',
                  color: '#1877f2'
                }}
              >
                {plan.title}
              </Link>
              <p>{plan.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlanList;