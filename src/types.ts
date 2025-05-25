export type TaskFunction<T = unknown> = () => Promise<T>;

export interface QueueTask<T = unknown> {
  fn: TaskFunction<T>;
  priority: number;
  retries: number;
  resolve: (result: T) => void;
  reject: (err: any) => void;
}

export interface QueueOptions {
  maxConcurrent?: number;
  defaultRetries?: number;
}
