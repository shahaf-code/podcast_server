import { Router, Request, Response } from 'express';
import { convertWavToHls } from '../services/convert_file';
const path = require('path')

const router: Router = Router();

router.get('/process-hls', async (req: Request, res: Response) => {

  console.log(req.query.path);
  const filePath = req.query.path;
  if (!filePath || typeof filePath !== 'string') {
    res.status(502).send('Input file does not exist.');
    return;
  }
  try {
      const result = await convertWavToHls(filePath, `src/hls_destenation/${path.basename(filePath)}`)
      res.status(201).send(`HLS playlist created at: ${result}`);
  } catch (err) {
    res.status(500).send(`Failed to convert. ${err}`);
  };
});
export default router;
