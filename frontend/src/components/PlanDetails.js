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
    <div style={{ padding: '20px' }}>
      <h2>{plan.title}</h2>
      <p>{plan.description}</p>
      <p><strong>Created by User ID:</strong> {plan.createdByUserId}</p>

      {!started && (
        <button onClick={handleStart}>Start Learning Plan</button>
      )}

      {started && (
        <div style={{ margin: '20px 0' }}>
          <label><strong>Progress:</strong></label>
          <progress value={plan.lessons.filter(l => l.completed).length} max={plan.lessons.length} style={{ width: '100%' }}></progress>
          <p>{Math.round((plan.lessons.filter(l => l.completed).length / plan.lessons.length) * 100)}%</p>
        </div>
      )}

      {plan.lessons.map((lesson) => (
        <div key={lesson.id} style={{ marginTop: '10px' }}>
          {started && <input type="checkbox" />}
          <strong>{lesson.title}</strong>
          <ul>
            {lesson.resources.map((res) => (
              <li key={res.id}><a href={res.url} target="_blank" rel="noopener noreferrer">{res.url}</a></li>
            ))}
          </ul>
        </div>
      ))}

      {currentUserId === plan.createdByUserId && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleUpdate} style={{ marginRight: '10px' }}>Update Plan</button>
          <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete Plan</button>
        </div>
      )}
    </div>
  );
}

export default PlanDetails;