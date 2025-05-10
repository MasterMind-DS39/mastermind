import React from 'react';

function LessonProgress({ lessons }) {
  const completedCount = lessons.filter((l) => l.completed).length;
  const total = lessons.length;
  const progress = Math.round((completedCount / total) * 100);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h4>Progress</h4>
      <div style={{ background: '#ccc', height: '20px', borderRadius: '10px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${progress}%`,
            background: 'blue',
            height: '100%',
            transition: '0.5s',
          }}
        ></div>
      </div>
      <p>{progress}% complete</p>
    </div>
  );
}

export default LessonProgress;
