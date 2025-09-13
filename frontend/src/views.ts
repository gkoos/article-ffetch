import { renderUserList, renderUserView } from './ui';

export type View = 'userlist' | 'user';

export interface State {
  view: View;
  selectedUserId?: number;
}

export const state: State = {
  view: 'userlist',
};

export function setView(view: View, userId?: number) {
  state.view = view;
  state.selectedUserId = userId;
  render();
}

export function render() {
  const app = document.getElementById('app');
  if (!app) return;
  if (state.view === 'userlist') {
    renderUserList(app);
  } else if (state.view === 'user' && state.selectedUserId !== undefined) {
    renderUserView(app, state.selectedUserId);
  }
}
