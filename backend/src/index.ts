import express from 'express';
import path from 'path';
import cors from 'cors';


import usersRouter from './routes/users';
import tasksRouter from './routes/tasks';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
