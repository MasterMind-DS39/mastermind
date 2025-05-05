import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function PlanDetails() {
  const { id } = useParams(); // get :id from URL
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/plans/${id}`)
      .then(response => {
        setPlan(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching plan:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p style={{ padding: '20px', fontSize: '18px' }}>Loading...</p>;
  }

  if (!plan) {
    return <p style={{ padding: '20px', fontSize: '18px', color: 'red' }}>Plan not found</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <Link to="/" style={{ textDecoration: 'none', color: '#1877f2' }}>&larr; Back to all plans</Link>

      <h2 style={{ color: '#1877f2' }}>{plan.title}</h2>
      <p style={{ fontSize: '16px' }}>{plan.description}</p>
      <p style={{ fontSize: '14px' }}><strong>Upvotes:</strong> {plan.upvotes}</p>

      <h3 style={{ marginTop: '20px' }}>Lessons</h3>
      {plan.lessons.length === 0 ? (
        <p>No lessons available for this plan.</p>
      ) : (
        plan.lessons.map((lesson, idx) => (
          <div key={lesson.id} style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            backgroundColor: '#f8f9fa'
          }}>
            <h4 style={{ margin: '5px 0' }}>{idx + 1}. {lesson.title}</h4>
            <ul>
              {lesson.resources.map(resource => (
                <li key={resource.id}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1877f2' }}
                  >
                    {resource.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default PlanDetails;