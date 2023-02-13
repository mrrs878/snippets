/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2023-02-13 21:33:33
 * @LastEditors: mrrs878@foxmail.com
 * @LastEditTime: 2023-02-13 21:55:15
 */

import React, { FC } from 'react';
import { Table } from 'antd';
import { renderToNodeStream, renderToString, renderToPipeableStream } from 'react-dom/server';
import express from 'express';

const app = express();

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

// eslint-disable-next-line react/function-component-definition
const App: FC = () => (
  <div>
    {new Array(10).fill(0).map(() => (
      <Table dataSource={dataSource} columns={columns} />
    ))}
  </div>
);

app.get('/renderToNodeStream', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write(`
    <html>
        <head>
            <meta http-equiv="content-type" content="text/html; charset=utf-8">
        </head>
        <body>
            <div>First segment</div>
    `);

  res.write("<div id='root'>");

  const stream = renderToNodeStream(<App />);
  stream.pipe(res, { end: false });

  stream.on('end', () => {
    res.write('</div></body></html>');
    res.end();
  });
});

app.get('/renderToString', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write(`
  <html>
      <head>
          <meta http-equiv="content-type" content="text/html; charset=utf-8">
      </head>
      <body>
          <div>First segment</div>
  `);

  const html = renderToString(<App />);

  res.write(html);
  res.write('</div></body></html>');
  res.end();
});

app.get('/renderToPipeableStream', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write(`
  <html>
      <head>
          <meta http-equiv="content-type" content="text/html; charset=utf-8">
      </head>
      <body>
          <div>First segment</div>
  `);

  let didError = false;
  const stream = renderToPipeableStream(
    <App />,
    {
      bootstrapScripts: ['main.js'],
      onShellReady() {
        res.statusCode = didError ? 500 : 200;
        stream.pipe(res);
      },
      onShellError() {
        res.statusCode = 500;
        res.send('<!doctype html><p>Loading...</p><script src="clientrender.js"></script>');
      },
      onAllReady() {
      // stream.pipe(res);
      },
      onError(err) {
        didError = true;
        console.error(err);
      },
    },
  );

  // stream.on('end', () => {
  //   res.write('</div></body></html>');
  //   res.end();
  // });
});

app.listen(3000, () => {
  console.log('app listening at 3000');
});

export { };
