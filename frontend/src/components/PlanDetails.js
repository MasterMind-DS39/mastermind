// components/PlanList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function PlanList({ title, endpoint, showActions = false }) {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(endpoint)
      .then(response => setPlans(response.data))
      .catch(error => console.error('Error fetching plans:', error));
  }, [endpoint]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      axios.delete(`http://localhost:8080/api/plans/${id}`)
        .then(() => {
          setPlans(plans.filter(plan => plan.id !== id));
        })
        .catch(error => console.error('Delete failed:', error));
    }
  };

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

              {showActions && (
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => navigate(`/edit/${plan.id}`)}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#1877f2',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    style={{
                      backgroundColor: '#e53935',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlanList;