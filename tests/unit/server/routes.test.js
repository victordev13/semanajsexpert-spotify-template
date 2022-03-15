import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import config from '../../../server/config.js';
import { Controller } from '../../../server/controller.js';

import { handler } from '../../../server/routes.js';
import TestUtil from '../_util/testUtil.js';

const {
  pages,
  location,
  constants: { CONTENT_TYPE },
} = config;

describe('#Routes - test suite for Api Response', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('GET / - should redirect to home page', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/';

    await handler(...params.values());
    expect(params.response.writeHead).toBeCalledWith(302, {
      Location: location.home,
    });
    expect(params.response.end).toHaveBeenCalled();
  });

  test(`GET /home - should response with ${pages.homeHtml} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/home';
    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });

    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();
    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHtml);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });

  test(`GET /controller - should response with ${pages.controllerHtml} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/controller';
    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(Controller.prototype, 'getFileStream').mockResolvedValue({
      stream: mockFileStream,
    });

    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(
      pages.controllerHtml
    );

    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });

  test(`GET /index.html - should response with file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    const expectedType = '.html';
    const expectedUrl = '/index.html';
    params.request.url = expectedUrl;

    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(Controller.prototype, 'getFileStream').mockResolvedValue({
      stream: mockFileStream,
      type: expectedType,
    });

    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(expectedUrl);

    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': CONTENT_TYPE[expectedType],
    });
  });

  test(`GET /file.ext - should response with file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    const expectedType = '.ext';
    const expectedUrl = '/index.html';
    params.request.url = expectedUrl;

    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(Controller.prototype, 'getFileStream').mockResolvedValue({
      stream: mockFileStream,
      type: expectedType,
    });

    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(expectedUrl);

    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).not.toHaveBeenCalled();
  });

  test(`POST /unknown - given an inexistent route it should response with 404`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'POST';
    const expectedUrl = '/unknown';
    params.request.url = expectedUrl;

    await handler(...params.values());

    expect(params.response.writeHead).toHaveBeenCalledWith(404);
    expect(params.response.end).toHaveBeenCalled();
  });

  describe('exceptions', () => {
    test('given inexistent file it should responde with 404', async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = 'GET';
      const expectedUrl = '/image.png';
      params.request.url = expectedUrl;

      jest
        .spyOn(Controller.prototype, 'getFileStream')
        .mockRejectedValue(new Error('Error: ENOENT: no shuch file directory'));

      await handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(404);
      expect(params.response.end).toHaveBeenCalled();
    });

    test('given an error it should respond with 500', async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = 'GET';
      const expectedUrl = '/image.png';
      params.request.url = expectedUrl;

      jest
        .spyOn(Controller.prototype, 'getFileStream')
        .mockRejectedValue(new Error('Error'));

      await handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(500);
      expect(params.response.end).toHaveBeenCalled();
    });
  });
});
