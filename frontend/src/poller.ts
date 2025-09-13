import createClient from '@gkoos/ffetch';

// Cache for responses
const cache: Record<string, any> = {};

// Create ffetch client
const api = createClient({
  timeout: 3000,
  retries: 2,
});


function cancelRequests() {
  api.abortAll();
}

export async function fetchUserListData() {
  cancelRequests();
  if (cache.userList) return cache.userList;
  try {
    const userIds = await api('http://localhost:3000/users').then(r => r.json());
    const users = await Promise.all(
      userIds.map((id: number) => api(`http://localhost:3000/users/${id}`).then(r => r.json()))
    );
    const taskCounts = await Promise.all(
      userIds.map((id: number) => api(`http://localhost:3000/users/${id}/tasks`).then(r => r.json()).then((tasks: any[]) => tasks.length))
    );
    cache.userList = { users, taskCounts };
    return cache.userList;
  } catch (err) {
    if (cache.userList) return cache.userList;
    throw err;
  }
}

export async function fetchUserDetailsData(userId: number) {
  cancelRequests();
  const cacheKey = `userDetails_${userId}`;
  if (cache[cacheKey]) return cache[cacheKey];
  try {
    const user = await api(`http://localhost:3000/users/${userId}`).then(r => r.json());
    const taskIds = await api(`http://localhost:3000/users/${userId}/tasks`).then(r => r.json());
    const tasks = await Promise.all(
      taskIds.map((id: number) => api(`http://localhost:3000/tasks/${id}`).then(r => r.json()))
    );
    cache[cacheKey] = { user, tasks };
    return cache[cacheKey];
  } catch (err) {
    if (cache[cacheKey]) return cache[cacheKey];
    throw err;
  }
}
