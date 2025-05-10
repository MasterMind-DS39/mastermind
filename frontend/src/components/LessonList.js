import React, { useState } from 'react';

function LessonList({ lessons }) {
  const [completedLessons, setCompletedLessons] = useState([]);

  const handleToggle = (lessonId) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  return (
    <div>
      <h3>Lessons</h3>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <label>
              <input
                type="checkbox"
                checked={completedLessons.includes(lesson.id)}
                onChange={() => handleToggle(lesson.id)}
              />
              {lesson.title}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LessonList;
