import { Request } from 'express';
import express from 'express';
import cors from 'cors';

const app = express();
import diaryRouter from './routes/diaries';
app.use(express.json());
app.use(cors<Request>());

const PORT = 3000;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/diaries', diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
