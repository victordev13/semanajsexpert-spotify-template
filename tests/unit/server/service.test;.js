import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';
import { Service } from '../../../server/service.js';

import { handler } from '../../../server/routes.js';
import TestUtil from '../_util/testUtil.js';

const {
  pages,
  location,
  constants: { CONTENT_TYPE },
} = config;

describe('#Service - test suite for File Streams', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('should return file info from existing file', async () => {
    const service = new Service();
    const fileInfo = await service.getFileInfo('my-file');
  });
});
