import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function OngoingPlans() {
  const [plans, setPlans] = useState([]);
  const userId = 1;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUpdatedPlans = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/plans/started/${userId}`
        );

        const plansWithProgress = await Promise.all(
          response.data.map(async (plan) => {
            const progressRes = await axios.get(
              `http://localhost:8080/api/plans/progress`,
              {
                params: {
                  userId: userId,
                  planId: plan.id,
                },
              }
            );
            const completedLessonIds = progressRes.data;
            const lessonsWithProgress = plan.lessons.map((lesson) => ({
              ...lesson,
              completed: completedLessonIds.includes(lesson.id),
            }));
            return { ...plan, lessons: lessonsWithProgress };
          })
        );

        setPlans(plansWithProgress);
      } catch (err) {
        console.error("Error fetching plans or progress:", err);
      }
    };

    fetchUpdatedPlans();
  }, [location]);

  const fetchPlans = () => {
    axios
      .get(`http://localhost:8080/api/plans/started/${userId}`)
      .then((response) => setPlans(response.data))
      .catch((error) => console.error(error));
  };

  const calculateProgress = (plan) => {
    const total = plan.lessons.length;
    const completed = plan.lessons.filter((l) => l.completed === true).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const getNextLesson = (plan) => {
    return (
      plan.lessons.find((l) => !l.completed)?.title || "All tasks completed!"
    );
  };

  const handleCompletionToggle = (lessonId, isCompleted) => {
    axios
      .put(`http://localhost:8080/api/lessons/${lessonId}/complete`, {
        completed: isCompleted,
      })
      .then(() => fetchPlans())
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Segoe UI, sans-serif" }}>
      <h2
        style={{
          color: "#1877f2",
          fontSize: "28px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        📘 Ongoing Learning Plans
      </h2>
      {plans.length === 0 ? (
        <p style={{ textAlign: "center", color: "#777" }}>
          No ongoing plans found.
        </p>
      ) : (
        plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => navigate(`/plans/${plan.id}`)}
            style={{
              cursor: "pointer",
              border: "1px solid #ddd",
              borderRadius: "12px",
              marginBottom: "25px",
              padding: "25px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
          >
            <h3 style={{ color: "#333", fontSize: "22px" }}>{plan.title}</h3>
            <p style={{ color: "#555" }}>{plan.description}</p>

            <div
              style={{
                background: "linear-gradient(to right, #e0eafc, #cfdef3)",
                borderRadius: "6px",
                height: "24px",
                marginBottom: "12px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${calculateProgress(plan)}%`,
                  background: "linear-gradient(to right, #4facfe, #00f2fe)",
                  height: "100%",
                  textAlign: "center",
                  color: "white",
                  lineHeight: "24px",
                  fontWeight: "bold",
                  transition: "width 0.4s ease",
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                {calculateProgress(plan)}%
              </div>
            </div>

            <p style={{ fontWeight: "bold", color: "#1877f2" }}>
              📌 Next Task:{" "}
              <span style={{ color: "#000" }}>{getNextLesson(plan)}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default OngoingPlans;
