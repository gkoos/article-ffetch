import { getUserIds, getUser, getUserTaskIds, getTask } from './api';

export async function fetchUserListData() {
  const userIds = await getUserIds();
  const users = await Promise.all(userIds.map(id => getUser(id)));
  const taskCounts = await Promise.all(userIds.map(id => getUserTaskIds(id).then(tasks => tasks.length)));
  return { users, taskCounts };
}

export async function fetchUserDetailsData(userId: number) {
  const user = await getUser(userId);
  const taskIds = await getUserTaskIds(userId);
  const tasks = await Promise.all(taskIds.map(id => getTask(id)));
  return { user, tasks };
}
