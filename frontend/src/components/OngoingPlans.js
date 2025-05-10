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
          color: "#4A90E2",
          fontSize: "32px",
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        📘 Ongoing Learning Plans
      </h2>
      {plans.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", fontSize: "18px" }}>
          No ongoing plans found. Start your learning journey today!
        </p>
      ) : (
        plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => navigate(`/plans/${plan.id}`)}
            style={{
              cursor: "pointer",
              border: "1px solid #ddd",
              borderRadius: "16px",
              marginBottom: "25px",
              padding: "25px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.1)";
            }}
          >
            <h3
              style={{
                color: "#333",
                fontSize: "24px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              {plan.title}
            </h3>
            <p
              style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}
            >
              {plan.description}
            </p>

            <div
              style={{
                background: "#e6f7ff",
                borderRadius: "8px",
                height: "28px",
                marginBottom: "15px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${calculateProgress(plan)}%`,
                  background: "linear-gradient(to right, #4facfe, #00f2fe)",
                  height: "100%",
                  textAlign: "center",
                  color: "white",
                  lineHeight: "28px",
                  fontWeight: "bold",
                  transition: "width 0.4s ease",
                  boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
                  borderRadius: "8px 0 0 8px",
                }}
              >
                {calculateProgress(plan)}%
              </div>
            </div>

            <p
              style={{
                fontWeight: "bold",
                color: "#4A90E2",
                fontSize: "16px",
                marginTop: "10px",
              }}
            >
              📌 Next Task:{" "}
              <span style={{ color: "#000", fontWeight: "normal" }}>
                {getNextLesson(plan)}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default OngoingPlans;
