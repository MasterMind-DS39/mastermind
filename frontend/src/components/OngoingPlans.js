import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OngoingPlans() {
  const [plans, setPlans] = useState([]);
  const userId = 1;

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = () => {
    axios.get(`http://localhost:8080/api/plans/user/${userId}/ongoing`)
      .then(response => setPlans(response.data))
      .catch(error => console.error(error));
  };

  const calculateProgress = (plan) => {
    const total = plan.lessons.length;
    const completed = plan.lessons.filter(l => l.completed === true).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const getNextLesson = (plan) => {
    return plan.lessons.find(l => !l.completed)?.title || 'All tasks completed!';
  };

  const handleCompletionToggle = (lessonId, isCompleted) => {
    axios.put(`http://localhost:8080/api/lessons/${lessonId}/complete`, { completed: isCompleted })
      .then(() => fetchPlans())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2 style={{ color: '#1877f2' }}>Ongoing Learning Plans</h2>
      {plans.length === 0 ? (
        <p>No ongoing plans found.</p>
      ) : (
        plans.map(plan => (
          <div key={plan.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f0f8ff'
          }}>
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>

            {/* Progress Bar */}
            <div style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              height: '20px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: `${calculateProgress(plan)}%`,
                backgroundColor: '#1877f2',
                height: '100%',
                borderRadius: '4px',
                textAlign: 'center',
                color: 'white',
                fontSize: '12px'
              }}>
                {calculateProgress(plan)}%
              </div>
            </div>

            <p><strong>Next Task:</strong> {getNextLesson(plan)}</p>

            {/* Lesson Checklist */}
            <ul>
              {plan.lessons.map(lesson => (
                <li key={lesson.id}>
                  <input
                    type="checkbox"
                    checked={lesson.completed || false}
                    onChange={(e) => handleCompletionToggle(lesson.id, e.target.checked)}
                  />
                  {" "}
                  {lesson.title}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default OngoingPlans;