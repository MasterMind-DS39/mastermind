const API_BASE = 'http://localhost:8080/api/users';

export async function fetchUser(userId) {
  const response = await fetch(`${API_BASE}/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

export async function updateUser(userId, userData) {
  const response = await fetch(`${API_BASE}/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
}

export async function deleteUser(userId) {
  const response = await fetch(`${API_BASE}/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete user');
  return true;
}
