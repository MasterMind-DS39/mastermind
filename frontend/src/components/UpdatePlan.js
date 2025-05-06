import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateLearningPlan() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/plans/${planId}`)
      .then(res => setPlan(res.data))
      .catch(err => console.error('Failed to fetch plan', err));
  }, [planId]);

  const handlePlanChange = (e) => {
    setPlan({ ...plan, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (index, value) => {
    const updated = [...plan.lessons];
    updated[index].title = value;
    setPlan({ ...plan, lessons: updated });
  };

  const handleResourceChange = (lessonIndex, resourceIndex, value) => {
    const updated = [...plan.lessons];
    updated[lessonIndex].resources[resourceIndex].url = value;
    setPlan({ ...plan, lessons: updated });
  };

  const handleSubmit = (e) => {
    console.log(plan);
    e.preventDefault();
    axios.put(`http://localhost:8080/api/plans/${planId}`, plan)
      .then(() => {
        alert('Plan updated successfully!');
        navigate(`/api/plan/${planId}`);
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Failed to update plan');
      });
  };

  if (!plan) return <p>Loading...</p>;

  return (
    <div style={{ 
      padding: '30px', 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '700px', 
      margin: 'auto', 
      backgroundColor: '#f0f2f5', 
      borderRadius: '10px', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
    }}>
      <h2 style={{ color: '#1877f2', marginBottom: '20px' }}>Update Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={plan.title}
          onChange={handlePlanChange}
          placeholder="Plan Title"
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        />
        <textarea
          name="description"
          value={plan.description}
          onChange={handlePlanChange}
          placeholder="Plan Description"
          required
          rows="4"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '25px'
          }}
        />

        {plan.lessons.map((lesson, i) => (
          <div key={lesson.id} style={{
            backgroundColor: '#fff',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            borderLeft: '5px solid #1877f2'
          }}>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => handleLessonChange(i, e.target.value)}
              placeholder={`Lesson ${i + 1} Title`}
              required
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            {lesson.resources.map((res, j) => (
              <input
                key={res.id}
                type="text"
                value={res.url}
                onChange={(e) => handleResourceChange(i, j, e.target.value)}
                placeholder={`Resource ${j + 1} URL`}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  border: '1px solid #eee',
                  borderRadius: '4px'
                }}
              />
            ))}
          </div>
        ))}

        <button type="submit" style={{
          backgroundColor: '#1877f2',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Save Changes</button>
      </form>
    </div>
  );
}

export default UpdateLearningPlan;