import fs from 'fs';
import fsPromises from 'fs/promises';
import { randomUUID } from 'crypto';
import { PassThrough, Writable } from 'stream';
import Throttle from 'throttle';
import childProcess from 'child_process';
import streamsPromises from 'stream/promises';
import { once } from 'events';

import config from './config.js';
import { join, extname } from 'path';
import { logger } from './utils.js';

const {
  dir: { publicDir },
  constants: { FALLBACK_BITRATE, ENGLISH_CONVERSATION, BITRATE_DIVISOR },
} = config;

export class Service {
  constructor() {
    this.clientStreams = new Map();
    this.currentSong = ENGLISH_CONVERSATION;
    this.currentBitRate = 0;
    this.throttleTransform = {};
    this.currentReadable = {};

    this.startStream();
  }

  createFileStream() {
    const id = randomUUID();
    const clientStream = new PassThrough();
    this.clientStreams.set(id, clientStream);

    return { id, clientStream };
  }

  removeClientStream(id) {
    this.clientStreams.delete(id);
  }

  _executeSoxCommand(args) {
    childProcess.spawn('sox', args);
  }

  async getBitRate(song) {
    try {
      const args = [
        '--i', // info
        '--B', // bitrate,
        song,
      ];

      const {
        stderr, // errors
        stdout, // log
        // stdin, // send/execute
      } = this._executeSoxCommand(args);
      await Promise.all([once(stdout, 'readable'), once(stderr, 'readable')]);

      const [success, error] = [stdout, stderr].map((stream) => stream.read());

      if (error) return Promise.reject(error);

      return success.toString().trim().replace(/k/, '000');
    } catch (error) {
      logger.error(`Erro ao retornar BitRate: ${error}`);
      return FALLBACK_BITRATE;
    }
  }

  broadCast() {
    return new Writable({
      write: (chunk, encoding, callback) => {
        for (const [key, stream] of this.clientStreams) {
          if (stream.writableEnded) {
            this.clientStreams.delete(id);
            continue;
          }

          stream.write(chunk);
        }

        callback();
      },
    });
  }

  async startStream() {
    logger.info(`starting with ${this.currentSong}`);
    const bitRate =
      (this.currentBitRate = await this.getBitRate(this.currentSong)) /
      BITRATE_DIVISOR;

    const throttleTransform = (this.throttleTransform = new Throttle(bitRate));
    const songReadable = (this.currentReadable = this.createFileStream());
    streamsPromises.pipeline(songReadable, throttleTransform, this.broadCast());
  }

  createFileStream(filename) {
    return fs.createReadStream(filename);
  }

  async getFileInfo(file) {
    const fullFilePath = join(publicDir, file);
    await fsPromises.access(fullFilePath); // validate if file exists

    const fileType = extname(fullFilePath);

    return {
      type: fileType,
      name: fullFilePath,
    };
  }

  async getFileStream(file) {
    const { name, type } = await this.getFileInfo(file);

    return {
      stream: this.createFileStream(name),
      type,
    };
  }
}
