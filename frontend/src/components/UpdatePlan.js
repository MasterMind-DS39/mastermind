import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateLearningPlan() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/plans/${planId}`)
      .then((res) => setPlan(res.data))
      .catch((err) => console.error("Failed to fetch plan", err));
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

  const handleAddLesson = () => {
    const newLesson = { title: "", resources: [] };
    setPlan({ ...plan, lessons: [...plan.lessons, newLesson] });
  };

  const handleDeleteLesson = (index) => {
    const updated = [...plan.lessons];
    updated.splice(index, 1);
    setPlan({ ...plan, lessons: updated });
  };

  const handleAddResource = (lessonIndex) => {
    const updated = [...plan.lessons];
    const newResource = { url: "" };
    updated[lessonIndex].resources.push(newResource);
    setPlan({ ...plan, lessons: updated });
  };

  const handleDeleteResource = (lessonIndex, resourceIndex) => {
    const updated = [...plan.lessons];
    updated[lessonIndex].resources.splice(resourceIndex, 1);
    setPlan({ ...plan, lessons: updated });
  };

  const handleSubmit = (e) => {
    console.log(plan);
    e.preventDefault();
    axios
      .put(`http://localhost:8080/api/plans/${planId}`, plan)
      .then(() => {
        alert("Plan updated successfully!");
        navigate(`/api/plan/${planId}`);
      })
      .catch((err) => {
        console.error("Update failed:", err);
        alert("Failed to update plan");
      });
  };

  if (!plan) return <p>Loading...</p>;

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "'Roboto', sans-serif",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#ffffff",
        borderRadius: "15px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
      }}
    >
      <h2
        style={{
          color: "#4a90e2",
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "28px",
        }}
      >
        Update Learning Plan
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={plan.title}
          onChange={handlePlanChange}
          placeholder="Plan Title"
          required
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "16px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
          }}
        />
        <textarea
          name="description"
          value={plan.description}
          onChange={handlePlanChange}
          placeholder="Plan Description"
          required
          rows="5"
          style={{
            width: "100%",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "30px",
            fontSize: "16px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
          }}
        />

        {plan.lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              borderLeft: "6px solid #4a90e2",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => handleLessonChange(i, e.target.value)}
              placeholder={`Lesson ${i + 1} Title`}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "15px",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
            <button
              type="button"
              onClick={() => handleDeleteLesson(i)}
              style={{
                color: "#e74c3c",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Delete Lesson
            </button>
            {lesson.resources.map((res, j) => (
              <div key={res.id} style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  value={res.url}
                  onChange={(e) => handleResourceChange(i, j, e.target.value)}
                  placeholder={`Resource ${j + 1} URL`}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteResource(i, j)}
                  style={{
                    color: "#e74c3c",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Delete Resource
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddResource(i)}
              style={{
                backgroundColor: "#4caf50",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              Add Resource
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddLesson}
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "12px 18px",
            border: "none",
            borderRadius: "8px",
            marginRight: "10px",
            marginTop: "20px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Add Lesson
        </button>

        <button
          type="submit"
          style={{
            backgroundColor: "#4a90e2",
            color: "white",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UpdateLearningPlan;
