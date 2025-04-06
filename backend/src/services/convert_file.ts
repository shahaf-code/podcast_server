import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

ffmpeg.setFfmpegPath(ffmpegPath!);

export function convertWavToHls(inputPath: string, outputDir: string): Promise<string> {
  // Convert the wav file in the input path to HLS in the output dir.
  return new Promise((resolve, reject) => {
    // Check again if file exists
    if (!fs.existsSync(inputPath)) {
      return reject(new Error('Input file does not exist.'));
    }

    // Check if it's a .wav file
    if (path.extname(inputPath).toLowerCase() !== '.wav') {
      return reject(new Error('Input file is not a WAV file.'));
    }

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const baseName = path.basename(inputPath, '.wav');
    const outputPath = path.join(outputDir, `${baseName}.m3u8`);

    // Convert to HLS
    ffmpeg(inputPath)
      .audioCodec('aac')
      .format('hls')
      .outputOptions([
        '-hls_time 10',               
        '-hls_segment_filename', path.join(outputDir, `${baseName}_%03d.ts`)
      ])
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

