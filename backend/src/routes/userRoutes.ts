import { Router, Request, Response } from 'express';
import { convertWavToHls } from '../services/convert_file';
const path = require('path')

const router: Router = Router();

router.get('/process-hls', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.()

  console.log(req.query.path);
  const filePath = req.query.path;
  if (!filePath || typeof filePath !== 'string') {
    res.status(502).send('Input file does not exist.');
    return;
  }
  try {
      const result = await convertWavToHls(filePath, `src/hls_destenation/${path.basename(filePath)}`, res)
  } catch (err) {
    res.status(500).send(`Failed to convert. ${err}`);
  };
});
export default router;
