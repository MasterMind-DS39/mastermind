import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFlagCheckered } from "react-icons/fa";

function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [started, setStarted] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const currentUserId = 1; // Replace with actual logged-in user ID in real implementation

  useEffect(() => {
    fetch(`http://localhost:8080/api/plans/${planId}`)
      .then((res) => res.json())
      .then((data) => setPlan(data))
      .catch((err) => console.error("Error fetching plan:", err));
  }, [planId]);

  useEffect(() => {
    async function checkIfStarted() {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/plans/started/${currentUserId}`
        );
        const startedPlanIds = res.data.map((p) => p.id);
        if (startedPlanIds.includes(parseInt(planId))) {
          setStarted(true);
        }
      } catch (err) {
        console.error("Error checking started plans:", err);
      }
    }

    if (plan && !started) {
      checkIfStarted();
    }
  }, [plan, planId, started]);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/plans/progress`,
          {
            params: {
              userId: currentUserId,
              planId: planId,
            },
          }
        );
        const completedIds = res.data;
        setCompletedLessonIds(completedIds);
        setPlan((prev) => ({
          ...prev,
          lessons: prev.lessons.map((l) => ({
            ...l,
            completed: completedIds.includes(l.id),
          })),
        }));
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    }

    if (plan && plan.lessons) {
      fetchProgress();
    }
  }, [planId, plan, completedLessonIds]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/plans/${plan.id}`);
      alert("Plan deleted successfully");
      navigate("/"); // Adjust this route as needed
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete the plan");
    }
  };

  const handleCheckboxChange = async (lesson) => {
    const isChecked = !lesson.completed;
    try {
      await axios.put(`http://localhost:8080/api/plans/progress`, null, {
        params: {
          userId: currentUserId,
          lessonId: lesson.id,
          completed: isChecked,
        },
      });
      setCompletedLessonIds((prev) =>
        isChecked
          ? [...(prev || []), lesson.id]
          : prev.filter((id) => id !== lesson.id)
      );
      setPlan((prev) => ({
        ...prev,
        lessons: prev.lessons.map((l) =>
          l.id === lesson.id ? { ...l, completed: isChecked } : l
        ),
      }));
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  if (!plan) return <p>Loading...</p>;

  const handleStart = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/plans/start/${currentUserId}/${plan.id}`
      );
      setStarted(true);
    } catch (err) {
      console.error("Error starting the plan:", err);
    }
  };

  const handleUpdate = () => {
    navigate(`/update_plan/${plan.id}`);
  };

  const handleGenerateQuiz = async () => {
    const completedLessons = plan.lessons
      .filter((lesson) => lesson.completed)
      .map((lesson) => lesson.title);

    if (completedLessons.length === 0) return;

    try {
      setIsGeneratingQuiz(true);
      const res = await axios.post(
        "http://localhost:8080/api/ai/generate-quiz",
        completedLessons
      );
      setQuiz(res.data);
      console.log("Quiz generated:", res.data);
    } catch (err) {
      console.error("Failed to generate quiz:", err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleFinishPlan = async () => {
    try {
      // Remove from started
      await axios.delete(
        `http://localhost:8080/api/plans/finish/${currentUserId}/${plan.id}`
      );

      // Mark as completed
      const allLessonsCompleted = plan.lessons.every(
        (lesson) => lesson.completed
      );
      if (allLessonsCompleted) {
        await axios.put(
          `http://localhost:8080/api/plans/complete/${currentUserId}/${plan.id}`
        );
      }

      alert("Plan finished!");
      navigate(allLessonsCompleted ? "/completed-plans" : "/");
    } catch (err) {
      console.error("Error finishing the plan:", err);
      alert("Failed to finish the plan.");
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Segoe UI, sans-serif",
        backgroundColor: "#f0f2f5",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ color: "#1877f2", marginBottom: "10px" }}>{plan.title}</h2>
      <p style={{ fontSize: "16px", color: "#333" }}>{plan.description}</p>
      <p style={{ fontSize: "14px", color: "#666" }}>
        <strong>Created by User ID:</strong> {plan.createdByUserId}
      </p>

      {!started && (
        <button
          onClick={handleStart}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "15px",
          }}
        >
          Start Learning Plan
        </button>
      )}

      {started && (
        <div style={{ margin: "20px 0" }}>
          <label>
            <strong>Progress:</strong>
          </label>
          <progress
            value={plan.lessons.filter((l) => l.completed).length}
            max={plan.lessons.length}
            style={{ width: "100%" }}
          ></progress>
          <p style={{ fontSize: "14px", marginTop: "5px" }}>
            {Math.round(
              (plan.lessons.filter((l) => l.completed).length /
                plan.lessons.length) *
                100
            )}
            %
          </p>
          {started && (
            <div style={{ marginTop: "20px" }}>
              {plan.lessons.filter((l) => l.completed).length === 0 ? (
                <p style={{ color: "#888" }}>
                  Complete at least one lesson to generate a quiz.
                </p>
              ) : (
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f7b928",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isGeneratingQuiz ? "Generating..." : "Generate Quiz"}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {plan.lessons.map((lesson) => (
        <div
          key={lesson.id}
          style={{
            marginTop: "15px",
            padding: "15px",
            backgroundColor: "#fff",
            borderRadius: "6px",
            boxShadow: "0 0 5px rgba(0,0,0,0.05)",
          }}
        >
          {started && (
            <input
              type="checkbox"
              style={{ marginRight: "10px" }}
              checked={lesson.completed}
              onChange={() => handleCheckboxChange(lesson)}
            />
          )}
          <strong style={{ color: "#333" }}>{lesson.title}</strong>
          <ul style={{ marginTop: "10px" }}>
            {lesson.resources.map((res) => (
              <li key={res.id}>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1877f2" }}
                >
                  {res.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {currentUserId === plan.createdByUserId && (
        <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
          <button
            onClick={handleUpdate}
            style={{
              padding: "10px 20px",
              backgroundColor: "#42b72a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Update Plan
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete Plan
          </button>
        </div>
      )}
      {quiz && (
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "6px",
            boxShadow: "0 0 5px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ color: "#1877f2" }}>Quiz</h3>
          <ul style={{ paddingLeft: "20px" }}>
            {quiz.questions.map((q, index) => (
              <li key={index} style={{ marginBottom: "15px" }}>
                <strong>Q{index + 1}:</strong> {q.question}
                <ul style={{ listStyleType: "none", paddingLeft: "15px" }}>
                  {Object.entries(q.options).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  ))}
                </ul>
                <em style={{ color: "green" }}>
                  Correct Answer: {q.correctAnswer}
                </em>
              </li>
            ))}
          </ul>
        </div>
      )}
      {started && (
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <button
            onClick={handleFinishPlan}
            style={{
              padding: "10px 15px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaFlagCheckered />
            Finish Plan
          </button>
        </div>
      )}
    </div>
  );
}

export default PlanDetails;
