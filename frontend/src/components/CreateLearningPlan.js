import React, { useState } from 'react';
import axios from 'axios';

function CreateLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdByUserId, setCreatedByUserId] = useState(1); // static for now
  const [lessons, setLessons] = useState([{ title: '', resources: [{ url: '' }] }]);

  const handleLessonChange = (index, value) => {
    const updated = [...lessons];
    updated[index].title = value;
    setLessons(updated);
  };

  const handleResourceChange = (lessonIndex, resourceIndex, value) => {
    const updated = [...lessons];
    updated[lessonIndex].resources[resourceIndex].url = value;
    setLessons(updated);
  };

  const addLesson = () => {
    setLessons([...lessons, { title: '', resources: [{ url: '' }] }]);
  };

  const addResource = (lessonIndex) => {
    const updated = [...lessons];
    updated[lessonIndex].resources.push({ url: '' });
    setLessons(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/plans/${createdByUserId}`, {
        title,
        description,
        lessons
      });
      alert('Plan created successfully!');
      console.log(response.data);
    } catch (error) {
      alert('Error creating plan');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <br />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <br />

        {lessons.map((lesson, i) => (
          <div key={i}>
            <input
              type="text"
              placeholder={`Lesson ${i + 1} Title`}
              value={lesson.title}
              onChange={(e) => handleLessonChange(i, e.target.value)}
              required
            />
            {lesson.resources.map((res, j) => (
              <div key={j}>
                <input
                  type="text"
                  placeholder={`Resource ${j + 1} URL`}
                  value={res.url}
                  onChange={(e) => handleResourceChange(i, j, e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={() => addResource(i)}>+ Add Resource</button>
          </div>
        ))}

        <button type="button" onClick={addLesson}>+ Add Lesson</button>
        <br /><br />
        <button type="submit">Create Plan</button>
      </form>
    </div>
  );
}

export default CreateLearningPlan;