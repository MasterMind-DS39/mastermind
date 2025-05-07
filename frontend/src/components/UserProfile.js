import React, { useEffect, useState } from 'react';
import { fetchUser, updateUser, deleteUser } from '../services/api';

const styles = {
  container: {
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    border: '1px solid #ddd',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
    maxWidth: 350,
    margin: 'auto'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #4e94f3',
    marginBottom: 15,
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 12,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    padding: 8,
    minHeight: 80,
    marginBottom: 12,
    borderRadius: 5,
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    display: 'block',
  },
  btn: {
    backgroundColor: '#4e94f3',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: 7,
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
    marginBottom: 8,
  },
  btnSecondary: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: 7,
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
    marginBottom: 8,
  },
  error: {
    color: '#e74c3c',
    marginBottom: 12,
  },
  success: {
    color: '#2ecc71',
    marginBottom: 12,
  },
};

export default function UserProfile({ userId }) {
  const [user, setUser] = useState({
    username: '',
    email: '',
    fullName: '',
    bio: '',
    avatarUrl: '',
    skills: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      setError('');
      setSuccessMsg('');
      setDeleted(false);
      try {
        const data = await fetchUser(userId);
        setUser({
          username: data.username || '',
          email: data.email || '',
          fullName: data.fullName || '',
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
          skills: data.skills || '',
        });
        setEditMode(false);
      } catch (err) {
        setError('User not found or server error');
        setEditMode(true);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setSuccessMsg('');
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      await updateUser(userId, user);
      setSuccessMsg('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }
    setError('');
    setSuccessMsg('');
    try {
      setLoading(true);
      await deleteUser(userId);
      setDeleted(true);
      setSuccessMsg('Profile deleted successfully.');
    } catch (err) {
      setError('Failed to delete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleAvatarClick() {
    const url = prompt('Enter new avatar URL:', user.avatarUrl);
    if (url !== null) {
      setUser(prev => ({ ...prev, avatarUrl: url }));
    }
  }

  function toggleEdit() {
    setEditMode(!editMode);
    setSuccessMsg('');
    setError('');
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 20 }}>Loading profile...</div>;
  }

  if (deleted) {
    return (
      <div style={styles.container}>
        <h3>Profile Deleted</h3>
        <p>The user profile has been deleted.</p>
      </div>
    );
  }

  if (!editMode) {
    // View mode UI
    return (
      <div style={styles.container}>
        {error && <div style={styles.error}>{error}</div>}
        <img
          src={user.avatarUrl || 'https://via.placeholder.com/100?text=Avatar'}
          alt="User Avatar"
          style={styles.avatar}
          onClick={handleAvatarClick}
          title="Click to change avatar URL"
        />
        <h3>{user.fullName || user.username}</h3>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Bio:</strong> {user.bio || 'No bio available'}</p>
        <p><strong>Skills:</strong> {user.skills || 'No skills listed'}</p>
        <button style={styles.btn} onClick={toggleEdit} aria-label="Update Profile">
          Update Profile
        </button>
        <button style={styles.btnSecondary} onClick={handleDelete} aria-label="Delete Profile">
          Delete Profile
        </button>
        {successMsg && <div style={styles.success}>{successMsg}</div>}
      </div>
    );
  }

  // Edit mode UI
  return (
    <form onSubmit={handleSubmit} style={styles.container}>
      {error && <div style={styles.error}>{error}</div>}
      {successMsg && <div style={styles.success}>{successMsg}</div>}

      <img
        src={user.avatarUrl || 'https://via.placeholder.com/100?text=Avatar'}
        alt="User Avatar"
        style={styles.avatar}
        onClick={handleAvatarClick}
        title="Click to change avatar URL"
      />

      <label style={styles.label} htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        type="text"
        style={styles.input}
        value={user.username}
        onChange={handleChange}
        required
      />

      <label style={styles.label} htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        style={styles.input}
        value={user.email}
        onChange={handleChange}
        required
      />

      <label style={styles.label} htmlFor="fullName">Full Name</label>
      <input
        id="fullName"
        name="fullName"
        type="text"
        style={styles.input}
        value={user.fullName}
        onChange={handleChange}
      />

      <label style={styles.label} htmlFor="bio">Bio</label>
      <textarea
        id="bio"
        name="bio"
        style={styles.textarea}
        value={user.bio}
        onChange={handleChange}
      />

      <label style={styles.label} htmlFor="skills">Skills (comma separated)</label>
      <input
        id="skills"
        name="skills"
        type="text"
        style={styles.input}
        value={user.skills}
        onChange={handleChange}
      />

      <button type="submit" style={styles.btn} aria-label="Save Profile">
        Save
      </button>
      <button
        type="button"
        style={{ ...styles.btn, backgroundColor: '#bbb', marginTop: 10 }}
        onClick={toggleEdit}
        aria-label="Cancel Edit"
      >
        Cancel
      </button>
    </form>
  );
}

