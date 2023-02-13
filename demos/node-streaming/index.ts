/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2023-02-09 11:51:01
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2023-02-13 21:31:56
 */

import express from 'express';

const app = express();

const sleep = (timeout) => new Promise((resolve) => {
  setTimeout(resolve, timeout);
});

app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write('<html><body><div>First segment</div>');

  await sleep(3000);

  res.write('<div>Second segment</div></body></html>');
  res.end();
});

app.listen(3000, () => {
  console.log('app listening at 3000');
});

export {};
