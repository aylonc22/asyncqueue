# asyncqueue-ts

[![npm version](https://img.shields.io/npm/v/asyncqueue-ts.svg)](https://www.npmjs.com/package/asyncqueue-ts)  
[![License](https://img.shields.io/npm/l/asyncqueue-ts.svg)](LICENSE)

---
## Description

`asyncqueue` is a lightweight, zero-dependency, fully TypeScript-typed library for managing asynchronous tasks with ease and precision. It offers:

- Priority-based task scheduling (high, normal, low)  
- Configurable concurrency limits to control parallelism  
- Automatic retries with exponential backoff for resilience  
- Graceful cancellation of queued or running tasks  
- Optional persistence adapters for queue recovery (e.g., localStorage)  
- Seamless React hook integration for declarative async task management  

Whether you are building backend APIs, frontend React apps, or serverless functions, `asyncqueue` helps you simplify complex async workflows, improve resource usage, and write safer, cleaner code.

---

## Features

- Typed task functions with metadata support  
- Add tasks with priority and retry options  
- Manage max concurrency of running tasks  
- Cancel individual tasks anytime  
- React hook for easy queue integration in components  
- Extensible persistence to survive crashes and reloads  

---

## Installation

```bash
npm install asyncqueue
```
# or
```
yarn add asyncqueue
```
## Usage
Node.js / Backend Example
```
import { createQueue } from 'asyncqueue'

const queue = createQueue({ concurrency: 3 })

queue.add(() => fetch('https://api.example.com/data'), {
  priority: 'high',
  retries: 3,
})

queue.run()
```
## React Frontend Example
```
import React from 'react'
import { useQueue } from 'asyncqueue'

function SearchComponent() {
  const { addTask, status } = useQueue({ concurrency: 2 })

  const handleSearch = (query: string) => {
    addTask(() => fetch(`/search?q=${query}`).then(res => res.json()), {
      priority: 'high',
      retries: 2,
    })
  }

  return (
    <div>
      <input onChange={e => handleSearch(e.target.value)} placeholder="Search..." />
      <p>Queue Status: {status}</p>
    </div>
  )
}
```
## API Reference
```createQueue(options)```
Creates a new async task queue.

```options.concurrency (number)```: Maximum number of tasks running in parallel (default: 1).

Returns an object with methods:

```add(taskFn, options)```: Adds a new async task to the queue.

```run()```: Starts processing tasks in the queue.

```cancel(taskId)```: Cancels a specific task by its ID.

```status```: Provides current queue status info.

```add(taskFn, options)```
Adds a new async task to the queue.

```taskFn: () => Promise<T>``` — Async function returning a promise.

```options.priority: 'high' | 'normal' | 'low' (default: 'normal')``` — Task priority.

```options.retries: number (default: 0)``` — Number of retry attempts on failure.

```options.backoff: number (default: 500)``` — Initial delay in ms for retries (exponential backoff).

Returns a Promise<T> resolving when the task completes successfully or rejects after all retries fail.

## React Hook: ```useQueue(options)```
A React hook for declarative queue management.

```options.concurrency (number)```: Max concurrent tasks (default: 1).

Returns:

```addTask(taskFn, options)```: Adds a task to the queue.

```status```: Current status of the queue (running, queued, errors).

```cancelTask(taskId)```: Cancel a queued or running task.

## Roadmap
Persistence adapters (localStorage, IndexedDB)

Web Worker integration for heavy frontend async tasks

Customizable priority levels and fine-tuning

Task progress reporting and lifecycle events

Dashboard or DevTools for queue monitoring

## Contributing
Contributions are welcome! Please open issues and submit pull requests to improve ```asyncqueue```.
Make sure to follow the code style and add tests for new features.

## License
MIT License © [Aylonc Cohen]
