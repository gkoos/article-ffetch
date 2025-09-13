import { setView, state } from './views';
import { fetchUserListData, fetchUserDetailsData } from './poller';

let userListFirstLoad = true;
let userListPollTimer: number | undefined;
export function renderUserList(app: HTMLElement) {
  if (userListFirstLoad) {
    app.innerHTML = '<h2>User List</h2><div>Loading...</div>';
  }
  async function update() {
    const { users, taskCounts } = await fetchUserListData();
  app.innerHTML = `<h2>User List</h2><ul>${users.map((u: { id: number; name: string }, i: number) => `<li><a href="#" data-user="${u.id}">${u.name}</a> (${taskCounts[i]} tasks)</li>`).join('')}</ul>`;
    app.querySelectorAll('a[data-user]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        userListFirstLoad = true;
        clearInterval(userListPollTimer);
        setView('user', Number((a as HTMLElement).dataset.user));
      });
    });
    userListFirstLoad = false;
  }
  update();
  clearInterval(userListPollTimer);
  userListPollTimer = window.setInterval(update, 3000);
}

let userViewFirstLoad: Record<number, boolean> = {};
let userViewPollTimer: number | undefined;
export function renderUserView(app: HTMLElement, userId: number) {
  if (userViewFirstLoad[userId] === undefined || userViewFirstLoad[userId]) {
    app.innerHTML = '<h2>User</h2><div>Loading...</div>';
  }
  async function update() {
    const { user, tasks } = await fetchUserDetailsData(userId);
  app.innerHTML = `<button id="back">Back</button><h2>${user.name}</h2><p>Email: ${user.email}</p><h3>Tasks</h3><ul>${tasks.map((t: { title: string; priority: string }) => `<li>${t.title} (${t.priority})</li>`).join('')}</ul>`;
    document.getElementById('back')?.addEventListener('click', () => {
      userViewFirstLoad[userId] = true;
      clearInterval(userViewPollTimer);
      setView('userlist');
    });
    userViewFirstLoad[userId] = false;
  }
  update();
  clearInterval(userViewPollTimer);
  userViewPollTimer = window.setInterval(update, 3000);
}
