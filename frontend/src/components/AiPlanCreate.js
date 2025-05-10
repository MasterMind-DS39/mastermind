import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AiPlanCreate() {
  const [topic, setTopic] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const userId = 1; // Hardcoded for now

  const handleGenerate = async () => {
    setLoading(true);
    console.log("Generating AI plan for topic:", topic);
    try {
      const res = await axios.post(
        "http://localhost:8080/api/ai/generate-plan",
        topic,
        {
          headers: { "Content-Type": "text/plain" },
        }
      );
      setAiResponse(res.data); // assuming backend returns JSON string
    } catch (error) {
      alert("Error generating plan");
      console.error(error);
    }
    setLoading(false);
  };

  const handleAccept = async () => {
    try {
      // Transform resources from strings to objects with url property
      const transformedPlan = {
        ...aiResponse,
        lessons: aiResponse.lessons.map((lesson) => ({
          ...lesson,
          resources: lesson.resources.map((res) => ({ url: res })),
        })),
      };

      const res = await axios.post(
        `http://localhost:8080/api/plans/${userId}`,
        transformedPlan
      );
      alert("AI plan accepted and saved!");
      setAccepted(true);
    } catch (error) {
      alert("Failed to save AI plan");
      console.error(error);
    }
  };

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "linear-gradient(to right, #e0f7fa, #ffffff)",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        maxWidth: "800px",
        margin: "30px auto",
      }}
    >
      <h2 style={{ color: "#1877f2", display: "flex", alignItems: "center" }}>
        🤖 AI Learning Plan Generator
      </h2>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={topic}
          placeholder="🎯 Enter a learning topic..."
          onChange={(e) => setTopic(e.target.value)}
          style={{
            padding: "12px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
        <button
          onClick={handleGenerate}
          style={{
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          disabled={loading}
        >
          {loading ? "✨ Generating..." : "🚀 Generate Plan"}
        </button>
      </div>

      {aiResponse && !accepted && (
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ color: "#333", display: "flex", alignItems: "center" }}>
            📘 {aiResponse.title}
          </h3>
          <p style={{ color: "#555", lineHeight: "1.6" }}>
            {aiResponse.description}
          </p>
          <ul style={{ paddingLeft: "20px" }}>
            {aiResponse.lessons?.map((lesson, i) => (
              <li key={i} style={{ marginBottom: "15px" }}>
                <strong>📚 {lesson.title}</strong>
                <ul style={{ paddingLeft: "20px" }}>
                  {lesson.resources?.map((res, j) => (
                    <li key={j}>
                      🔗{" "}
                      <a href={res} target="_blank" rel="noopener noreferrer">
                        {res}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <button
            onClick={handleAccept}
            style={{
              marginTop: "20px",
              backgroundColor: "#00c853",
              color: "white",
              padding: "12px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ✅ Accept Plan
          </button>
        </div>
      )}
    </div>
  );
}

export default AiPlanCreate;
