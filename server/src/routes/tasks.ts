import { type Request, type Response, Router } from 'express';
import * as taskRepo from '../db/taskRepository.js';
import { isDbConfigured } from '../db/client.js';

const router = Router();

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseId(param: string | undefined): number | null {
  if (param === undefined) return null;
  const n = Number.parseInt(param, 10);
  return Number.isNaN(n) ? null : n;
}

function isValidDate(s: string): boolean {
  if (!ISO_DATE.test(s)) return false;
  const d = new Date(s);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

router.get('/', async (req: Request, res: Response): Promise<void> => {
  if (!isDbConfigured()) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const from = typeof req.query.from === 'string' ? req.query.from : '';
  const to = typeof req.query.to === 'string' ? req.query.to : '';
  if (!from || !to) {
    res.status(400).json({ error: 'Query parameters "from" and "to" (YYYY-MM-DD) are required' });
    return;
  }
  if (!isValidDate(from) || !isValidDate(to)) {
    res.status(400).json({ error: 'Invalid date format; use YYYY-MM-DD' });
    return;
  }
  if (from > to) {
    res.status(400).json({ error: '"from" must be before or equal to "to"' });
    return;
  }
  try {
    const tasks = await taskRepo.findTasksInRange(from, to);
    res.json(tasks);
  } catch (err) {
    res.status(503).json({ error: (err as Error).message });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  if (!isDbConfigured()) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const { title, date } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim()) {
    res.status(400).json({ error: '"title" must be a non-empty string' });
    return;
  }
  const dateStr = typeof date === 'string' ? date : '';
  if (!dateStr || !isValidDate(dateStr)) {
    res.status(400).json({ error: '"date" must be a valid date string (YYYY-MM-DD)' });
    return;
  }
  try {
    const task = await taskRepo.createTask(title.trim(), dateStr);
    res.status(201).json(task);
  } catch (err) {
    res.status(503).json({ error: (err as Error).message });
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  if (!isDbConfigured()) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const id = parseId(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'Invalid task id' });
    return;
  }
  const body = req.body ?? {};
  const data: { title?: string; date?: string; order?: number } = {};
  if (body.title !== undefined) {
    if (typeof body.title !== 'string') {
      res.status(400).json({ error: '"title" must be a string' });
      return;
    }
    data.title = body.title.trim();
  }
  if (body.date !== undefined) {
    if (typeof body.date !== 'string' || !isValidDate(body.date)) {
      res.status(400).json({ error: '"date" must be a valid date string (YYYY-MM-DD)' });
      return;
    }
    data.date = body.date;
  }
  if (body.order !== undefined) {
    const o = Number(body.order);
    if (Number.isNaN(o) || o < 0) {
      res.status(400).json({ error: '"order" must be a non-negative number' });
      return;
    }
    data.order = o;
  }
  try {
    const task = await taskRepo.updateTask(id, data);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (err) {
    res.status(503).json({ error: (err as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  if (!isDbConfigured()) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const id = parseId(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  if (id === null) {
    res.status(400).json({ error: 'Invalid task id' });
    return;
  }
  try {
    const deleted = await taskRepo.deleteTask(id);
    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(503).json({ error: (err as Error).message });
  }
});

export const tasksRouter = router;
