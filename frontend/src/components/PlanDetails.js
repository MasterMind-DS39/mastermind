import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [started, setStarted] = useState(false);
  const currentUserId = 1; // Replace with actual logged-in user ID in real implementation

  useEffect(() => {
    fetch(`http://localhost:8080/api/plans/${planId}`)
      .then((res) => res.json())
      .then((data) => setPlan(data))
      .catch((err) => console.error("Error fetching plan:", err));
  }, [planId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/plans/${plan.id}`);
      alert("Plan deleted successfully");
      navigate('/'); // Adjust this route as needed
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete the plan");
    }
  };

  if (!plan) return <p>Loading...</p>;

  const handleStart = () => {
    setStarted(true);
  };

  const handleUpdate = () => {
    navigate(`/update_plan/${plan.id}`);
  };

  return (
  <div style={{
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f0f2f5',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <h2 style={{ color: '#1877f2', marginBottom: '10px' }}>{plan.title}</h2>
    <p style={{ fontSize: '16px', color: '#333' }}>{plan.description}</p>
    <p style={{ fontSize: '14px', color: '#666' }}>
      <strong>Created by User ID:</strong> {plan.createdByUserId}
    </p>

    {!started && (
      <button
        onClick={handleStart}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1877f2',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '15px'
        }}
      >
        Start Learning Plan
      </button>
    )}

    {started && (
      <div style={{ margin: '20px 0' }}>
        <label><strong>Progress:</strong></label>
        <progress value={plan.lessons.filter(l => l.completed).length} max={plan.lessons.length} style={{ width: '100%' }}></progress>
        <p style={{ fontSize: '14px', marginTop: '5px' }}>
          {Math.round((plan.lessons.filter(l => l.completed).length / plan.lessons.length) * 100)}%
        </p>
      </div>
    )}

    {plan.lessons.map((lesson) => (
      <div key={lesson.id} style={{
        marginTop: '15px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '6px',
        boxShadow: '0 0 5px rgba(0,0,0,0.05)'
      }}>
        {started && <input type="checkbox" style={{ marginRight: '10px' }} />}
        <strong style={{ color: '#333' }}>{lesson.title}</strong>
        <ul style={{ marginTop: '10px' }}>
          {lesson.resources.map((res) => (
            <li key={res.id}>
              <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ color: '#1877f2' }}>{res.url}</a>
            </li>
          ))}
        </ul>
      </div>
    ))}

    {currentUserId === plan.createdByUserId && (
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleUpdate}
          style={{
            padding: '10px 20px',
            backgroundColor: '#42b72a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Update Plan
        </button>
        <button
          onClick={handleDelete}
          style={{
            padding: '10px 20px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete Plan
        </button>
      </div>
    )}
  </div>
  );
}

export default PlanDetails;