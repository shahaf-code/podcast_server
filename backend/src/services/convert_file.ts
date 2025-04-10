import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { WAV_EXTENTION } from '../constants';
import {Response} from 'express'


ffmpeg.setFfmpegPath(ffmpegPath!);

interface SSEResponse extends Response {
  flush?(): void;
}

export async function convertWavToHls(inputPath: string, outputDir: string, res: SSEResponse) {
    // Check again if file exists
    if (!fs.existsSync(inputPath)) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Input file does not exist.' })}\n\n`);
      res.end();
      return;
        }
    // Check if it's a .wav file
    if (path.extname(inputPath).toLowerCase() !== WAV_EXTENTION) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'Input file is not a WAV file.' })}\n\n`);
      res.end();
      return;    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const baseName = path.basename(inputPath, WAV_EXTENTION);
    const outputPath = path.join(outputDir, `${baseName}.m3u8`);

    ffmpeg(inputPath)
      .audioCodec('aac')
      .format('hls')
      .outputOptions([
        '-hls_time 10',               
        '-hls_segment_filename', path.join(outputDir, `${baseName}_%03d.ts`)
      ])
      .output(outputPath)
      .on('progress', (progress) => {
        const payload = JSON.stringify({
          type: 'progress',
          percent: progress.percent?.toFixed(2) || 10,
        });
        console.log(payload)

        res.write(`data: ${payload}\n\n`);
        res.flush?.();
      })
      .on('end', () => {
        console.log("done")
        res.write(`data: {"type": "done"}\n\n`)
        res.flush?.();
        res.end();
      })
        
        .on('error', (err) => {
          res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
          res.end();
        })
        .run();
  ;
}

