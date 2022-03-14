import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';

const { pages } = config;

describe('#Routes - test suite for Api response', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test.todo('GET / - should redirect to home page');
  test.todo(`GET /home - should response with ${pages.homeHtml} file stream`);
  test.todo(
    `GET /controller - should response with ${pages.controllerHtml} file stream`
  );
  test.todo(`GET /file.ext - should response with file stream`);
  test.todo(
    `GET /unknown - given an inexistent route it should response with 404`
  );

  describe('exceptions', () => {
    test.todo('given inexistent file it should responde with 404');
    test.todo('given an error it should responde with 500');
  });
});
