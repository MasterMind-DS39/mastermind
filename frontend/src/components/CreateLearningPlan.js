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
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '30px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ color: '#0b66c2', textAlign: 'center' }}>Create Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', fontSize: '16px' }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', marginBottom: '20px', fontSize: '16px', height: '80px' }}
        />
        {lessons.map((lesson, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#ffffff' }}>
            <input
              type="text"
              placeholder={`Lesson ${i + 1} Title`}
              value={lesson.title}
              onChange={(e) => handleLessonChange(i, e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginBottom: '10px', fontSize: '15px' }}
            />
            {lesson.resources.map((res, j) => (
              <div key={j}>
                <input
                  type="text"
                  placeholder={`Resource ${j + 1} URL`}
                  value={res.url}
                  onChange={(e) => handleResourceChange(i, j, e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px', marginBottom: '8px', fontSize: '14px' }}
                />
              </div>
            ))}
            <button type="button" onClick={() => addResource(i)} style={{ backgroundColor: '#e1ecf4', color: '#0b66c2', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>
              + Add Resource
            </button>
          </div>
        ))}
        <button type="button" onClick={addLesson} style={{ backgroundColor: '#d6f5d6', color: '#228B22', border: 'none', padding: '10px 15px', cursor: 'pointer', borderRadius: '4px' }}>
          + Add Lesson
        </button>
        <br /><br />
        <button type="submit" style={{ backgroundColor: '#0b66c2', color: 'white', border: 'none', padding: '12px 20px', cursor: 'pointer', borderRadius: '6px', fontSize: '16px' }}>
          Create Plan
        </button>
      </form>
    </div>
  );
}

export default CreateLearningPlan;