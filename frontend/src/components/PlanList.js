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
  <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#e9ebee' }}>
    <h2 style={{
      color: '#1877f2',
      borderBottom: '2px solid #1877f2',
      paddingBottom: '10px',
      marginBottom: '20px'
    }}>{title}</h2>
    {plans.length === 0 ? (
      <p style={{ fontSize: '16px', color: '#606770' }}>No learning plans available.</p>
    ) : (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {plans.map(plan => (
          <li key={plan.id} style={{
            backgroundColor: '#fff',
            margin: '15px 0',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s',
          }}>
            <Link
              to={`/plans/${plan.id}`}
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                textDecoration: 'none',
                color: '#1877f2',
                display: 'block',
                marginBottom: '10px'
              }}
              onMouseOver={e => e.target.style.textDecoration = 'underline'}
              onMouseOut={e => e.target.style.textDecoration = 'none'}
            >
              {plan.title}
            </Link>
            <p style={{ margin: '8px 0', color: '#444' }}>{plan.description}</p>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#777' }}>Created by: {plan.createdBy}</p>
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#777' }}>Upvotes: {plan.upvotes}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
}

export default PlanList;