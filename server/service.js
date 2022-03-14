import fs from 'fs';
import fsPromises from 'fs/promises';

import config from './config.js';
import { join, extname } from 'path';

const {
  dir: { publicDir },
} = config;

export class Service {
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
