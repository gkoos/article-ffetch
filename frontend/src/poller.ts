// Cache for responses
const cache: Record<string, any> = {};

// AbortController for cancelling requests
let currentController: AbortController | undefined;

// Helper: fetch with retries and timeout
async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, timeout = 3000): Promise<any> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      clearTimeout(timer);
      if (attempt === retries) throw err;
    }
  }
}

// Cancel all previous requests
function cancelRequests() {
  if (currentController) currentController.abort();
  currentController = new AbortController();
}

export async function fetchUserListData() {
  cancelRequests();
  // Use cache if available
  if (cache.userList) return cache.userList;
  try {
  if (!currentController) throw new Error('AbortController not initialized');
  const userIds = await fetchWithRetry('http://localhost:3000/users', { signal: currentController!.signal });
  const users = await Promise.all(userIds.map((id: number) => fetchWithRetry(`http://localhost:3000/users/${id}`, { signal: currentController!.signal })));
  const taskCounts = await Promise.all(userIds.map((id: number) => fetchWithRetry(`http://localhost:3000/users/${id}/tasks`, { signal: currentController!.signal }).then((tasks: any[]) => tasks.length)));
    cache.userList = { users, taskCounts };
    return cache.userList;
  } catch (err) {
    // fallback to cache if available
    if (cache.userList) return cache.userList;
    throw err;
  }
}

export async function fetchUserDetailsData(userId: number) {
  cancelRequests();
  const cacheKey = `userDetails_${userId}`;
  if (cache[cacheKey]) return cache[cacheKey];
  try {
  if (!currentController) throw new Error('AbortController not initialized');
  const user = await fetchWithRetry(`http://localhost:3000/users/${userId}`, { signal: currentController!.signal });
  const taskIds = await fetchWithRetry(`http://localhost:3000/users/${userId}/tasks`, { signal: currentController!.signal });
  const tasks = await Promise.all(taskIds.map((id: number) => fetchWithRetry(`http://localhost:3000/tasks/${id}`, { signal: currentController!.signal })));
    cache[cacheKey] = { user, tasks };
    return cache[cacheKey];
  } catch (err) {
    if (cache[cacheKey]) return cache[cacheKey];
    throw err;
  }
}
