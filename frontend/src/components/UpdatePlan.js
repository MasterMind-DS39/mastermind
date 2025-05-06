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
    <div style={{ padding: '20px' }}>
      <h2>Update Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={plan.title}
          onChange={handlePlanChange}
          placeholder="Title"
          required
        /><br /><br />
        <textarea
          name="description"
          value={plan.description}
          onChange={handlePlanChange}
          placeholder="Description"
          required
        /><br /><br />

        {plan.lessons.map((lesson, i) => (
          <div key={lesson.id}>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => handleLessonChange(i, e.target.value)}
              required
            />
            {lesson.resources.map((res, j) => (
              <div key={res.id}>
                <input
                  type="text"
                  value={res.url}
                  onChange={(e) => handleResourceChange(i, j, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        ))}

        <button type="submit" style={{ marginTop: '20px' }}>Save Changes</button>
      </form>
    </div>
  );
}

export default UpdateLearningPlan;