import { describe, it, expect, vi } from 'vitest';
import { AsyncQueue } from '../src/queue';

describe('AsyncQueue', () => {
  it('executes tasks respecting max concurrency', async () => {
    const queue = new AsyncQueue({ maxConcurrent: 2 });

    const running: number[] = [];
    const results: number[] = [];

    const task = (id: number) => async () => {
      running.push(id);
      expect(running.length).toBeLessThanOrEqual(2); // never more than 2 running
      await new Promise((res) => setTimeout(res, 50));
      running.splice(running.indexOf(id), 1);
      results.push(id);
      return id;
    };

    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(queue.add(task(i)));
    }

    const values = await Promise.all(promises);
    expect(values).toEqual([0, 1, 2, 3, 4]);
  });

  it('retries failed tasks', async () => {
    const queue = new AsyncQueue({ maxConcurrent: 1, defaultRetries: 1 });
   
    let attempt = 0;
    const fn = async () => {
      if (attempt++ === 0) throw new Error('fail');
      return 'success';
    };

    const result = await queue.add(fn);
    expect(result).toBe('success');
  });

  it('honors priority', async () => {
    const queue = new AsyncQueue({ maxConcurrent: 1 });
    queue.pause();
    const result: number[] = [];
       
    const low = () => new Promise((res) => setTimeout(() => { result.push(1); res(1); }, 10));
    const high = () => new Promise((res) => setTimeout(() => { result.push(2); res(2); }, 10));  
   
  const p1 = queue.add(low, 1);   // lower priority
  const p2 = queue.add(high, 10); // higher priority

  queue.resume();

  await Promise.all([p1, p2]); // wait for both to finish

  expect(result).toEqual([2, 1]);  
  });
});
