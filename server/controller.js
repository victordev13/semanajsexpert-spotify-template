import { Service } from './service.js';
import { logger } from './utils.js';
export class Controller {
  constructor() {
    this.service = new Service();
  }

  async getFileStream(filename) {
    return this.service.getFileStream(filename);
  }

  createClientStream() {
    const { id, clientStream } = this.service.createFileStream();

    const onClose = () => {
      logger.info(`closing connection of ${id}`);
      this.service.removeClientStream(id);
    };

    return {
      onClose,
      stream: clientStream,
    };
  }
}
