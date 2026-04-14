/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();
  
  // Load ffmpeg.wasm from CDN for better performance and to avoid bundling issues
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg Log]', message);
    self.postMessage({ type: 'LOG', message });
  });

  ffmpeg.on('progress', ({ progress, time }) => {
    self.postMessage({ type: 'PROGRESS', progress, time });
  });

  return ffmpeg;
};

self.onmessage = async (event) => {
  const { type, data } = event.data;

  try {
    const ffmpegInstance = await loadFFmpeg();

    if (type === 'RENDER_VIDEO') {
      const { assets, outputName } = data;

      // Write assets to FFmpeg virtual file system
      for (const asset of assets) {
        await ffmpegInstance.writeFile(asset.name, await fetchFile(asset.url));
      }

      // Execute FFmpeg command
      // Example command: Concatenate images into a video
      // This is a placeholder, the actual command will depend on the storyboard
      await ffmpegInstance.exec([
        '-framerate', '1/5',
        '-i', 'img%d.jpg',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        outputName
      ]);

      // Read the output file
      const outputData = await ffmpegInstance.readFile(outputName);
      const videoBlob = new Blob([outputData], { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(videoBlob);

      self.postMessage({ type: 'RENDER_COMPLETE', videoUrl });
    }
  } catch (error) {
    console.error('FFmpeg Worker Error:', error);
    self.postMessage({ type: 'ERROR', error: (error as Error).message });
  }
};
