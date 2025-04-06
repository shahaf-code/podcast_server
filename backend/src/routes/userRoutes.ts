import { Router, Request, Response } from 'express';
import { convertWavToHls } from '../services/convert_file';
const path = require('path')

const router: Router = Router();

router.get('/process-hls', (req: Request, res: Response) => {
  console.log(req.query);
  const filePath = req.query.path;
  if (!filePath || typeof filePath !== 'string') {
    res.send('Input file does not exist.');
    return;
  }
  convertWavToHls(filePath, `src/hls_destenation/${path.basename(filePath)}`)
  .then(m3u8Path => {
    res.send({'HLS playlist created at:': m3u8Path});
  })
  .catch(err => {
    res.status(500).send(`Failed to convert. ${err}`);
  });
});
export default router;
