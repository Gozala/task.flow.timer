# @task.flow/timer

[![travis][travis.icon]][travis.url]
[![package][version.icon] ![downloads][downloads.icon]][package.url]
[![styled with prettier][prettier.icon]][prettier.url]

Utilities for tracking time in @task.flow

## Usage

```js
import Task from "@task.flow/task"
import Timer from "@task.flow/timer"

declare function someIO(): Task<Error, ArrayBuffer>

const maybeIO = Task.select(someIO(), Timer.timeout(2000))
// maybeIO:Task<Error, ?ArrayBuffer>
```

## Install

    npm install @task.flow/timer

[travis.icon]: https://travis-ci.org/Gozala/task.flow.timer.svg?branch=master
[travis.url]: https://travis-ci.org/Gozala/task.flow.timer
[version.icon]: https://img.shields.io/npm/v/@task.flow/timer.svg
[downloads.icon]: https://img.shields.io/npm/dm/@task.flow/timer.svg
[package.url]: https://npmjs.org/package/@task.flow/timer
[downloads.image]: https://img.shields.io/npm/dm/@task.flow/timer.svg
[downloads.url]: https://npmjs.org/package/@task.flow/timer
[prettier.icon]: https://img.shields.io/badge/styled_with-prettier-ff69b4.svg
[prettier.url]: https://github.com/prettier/prettier
