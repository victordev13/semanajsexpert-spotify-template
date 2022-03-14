import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, '../');
const audioDir = join(rootDir, 'audio');
const publicDir = join(rootDir, 'public');

export default {
  port: process.env.PORT || 3000,
  dir: {
    rootDir,
    publicDir,
    audioDir,
    songsDirectory: join(audioDir, 'songs'),
    fxDirectory: join(audioDir, 'fx'),
  },
  pages: {
    homeHtml: 'home/index.html',
    controllerHtml: 'controller/index.html',
  },
  location: {
    home: '/home',
  },
};
