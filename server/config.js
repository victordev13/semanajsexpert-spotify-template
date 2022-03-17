import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, '../');
const audioDir = join(rootDir, 'audio');
const publicDir = join(rootDir, 'public');
const songsDirectory = join(audioDir, 'songs');
const fxDirectory = join(audioDir, 'fx');

export default {
  port: process.env.PORT || 3000,
  dir: {
    rootDir,
    publicDir,
    audioDir,
    songsDirectory,
    fxDirectory,
  },
  pages: {
    homeHtml: 'home/index.html',
    controllerHtml: 'controller/index.html',
  },
  location: {
    home: '/home',
  },
  constants: {
    CONTENT_TYPE: {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
    },
    AUDIO_MEDIA_TYPE: 'mp3',
    SONG_VOLUME: '0.99',
    FALLBACK_BITRATE: '128000',
    BITRATE_DIVISOR: 8,
    ENGLISH_CONVERSATION: join(songsDirectory, 'conversation.mp3'),
  },
};
