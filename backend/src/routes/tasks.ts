import { Router } from 'express';
import { tasks } from '../data';
import { Task } from '../models';

const router = Router();

// GET /tasks - get all task ids
router.get('/', (req, res) => {
  res.json(tasks.map(t => t.id));
});

// GET /tasks/:id - get task by id
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// POST /tasks - create task
router.post('/', (req, res) => {
  const { title, description, priority } = req.body;
  const id = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const task: Task = { id, title, description, priority };
  tasks.push(task);
  res.json({ id });
});

// PUT /tasks/:id - update task
router.put('/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.title = req.body.title ?? task.title;
  task.description = req.body.description ?? task.description;
  task.priority = req.body.priority ?? task.priority;
  res.json({ message: 'Task updated' });
});

// DELETE /tasks/:id - delete task
router.delete('/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(idx, 1);
  res.json({ message: 'Task deleted' });
});

export default router;
