import { Router } from 'express';
import { users, userTasks } from '../data';
import { User } from '../models';

const router = Router();

// GET /users - get all user ids
router.get('/', (req, res) => {
  res.json(users.map(u => u.id));
});

// POST /users - create user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const user: User = { id, name, email };
  users.push(user);
  res.json({ id });
});

// GET /users/:id - get user by id
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// PUT /users/:id - update user
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  res.json({ message: 'User updated' });
});

// DELETE /users/:id - delete user
router.delete('/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(idx, 1);
  delete userTasks[Number(req.params.id)];
  res.json({ message: 'User deleted' });
});

// GET /users/:userId/tasks - get all tasks assigned to a user
router.get('/:userId/tasks', (req, res) => {
  const taskIds = userTasks[Number(req.params.userId)] ?? [];
  res.json(taskIds);
});

// POST /users/:userId/tasks/:taskId - assign a task to a user
router.post('/:userId/tasks/:taskId', (req, res) => {
  const userId = Number(req.params.userId);
  const taskId = Number(req.params.taskId);
  if (!userTasks[userId]) userTasks[userId] = [];
  if (!userTasks[userId].includes(taskId)) userTasks[userId].push(taskId);
  res.json({ message: 'Task assigned to user' });
});

// DELETE /users/:userId/tasks/:taskId - remove a task from a user
router.delete('/:userId/tasks/:taskId', (req, res) => {
  const userId = Number(req.params.userId);
  const taskId = Number(req.params.taskId);
  if (!userTasks[userId]) return res.status(404).json({ error: 'User not found' });
  userTasks[userId] = userTasks[userId].filter(id => id !== taskId);
  res.json({ message: 'Task removed from user' });
});

export default router;
