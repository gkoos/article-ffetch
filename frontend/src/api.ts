const API_BASE = 'http://localhost:3000';

export async function getUserIds(): Promise<number[]> {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

export async function getUser(id: number) {
  const res = await fetch(`${API_BASE}/users/${id}`);
  return res.json();
}

export async function getUserTaskIds(userId: number): Promise<number[]> {
  const res = await fetch(`${API_BASE}/users/${userId}/tasks`);
  return res.json();
}

export async function getTask(id: number) {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  return res.json();
}
