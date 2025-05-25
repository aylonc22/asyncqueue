import { QueueOptions, QueueTask, TaskFunction } from './types';

export class AsyncQueue {
  private maxConcurrent: number;
  private defaultRetries: number;
  private runningCount = 0;
  private queue: QueueTask<any>[] = [];
  private paused = false;

  constructor(options: QueueOptions = {}) {
    this.maxConcurrent = options.maxConcurrent || 5;
    this.defaultRetries = options.defaultRetries || 0;
  }

  public add<T>(fn: TaskFunction<T>, priority = 0, retries = this.defaultRetries): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task: QueueTask<T> = { fn, priority, retries, resolve, reject };
      this.queue.push(task);
      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }

  public pause() {
    this.paused = true;
  }

  public resume() {
    if (!this.paused) return;
    this.paused = false;
    this.process();
  }

  private async process() {
    while (!this.paused && this.runningCount < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) return;

      this.runningCount++;

      try {
        const result = await task.fn();
        task.resolve(result);
      } catch (err) {
        if (task.retries > 0) {
          task.retries--;
          this.queue.push(task); // re-add to queue
          this.queue.sort((a, b) => b.priority - a.priority);
        } else {
          task.reject(err);
        }
      } finally {
        this.runningCount--;
        this.process(); // try to run next
      }
    }
  }
}
