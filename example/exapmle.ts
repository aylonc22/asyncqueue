import { AsyncQueue } from '../src/queue';

async function main() {
  const queue = new AsyncQueue({ maxConcurrent: 2, defaultRetries: 1 });

  const taskFactory = (id: number, duration: number) => async () => {
    console.log(`Task ${id} started`);
    await new Promise((res) => setTimeout(res, duration));
    if (Math.random() < 0.3) { // simulate random failure ~30%
      console.log(`Task ${id} failed`);
      throw new Error(`Task ${id} error`);
    }
    console.log(`Task ${id} finished`);
    return id;
  };

  // Add tasks with varying priority (higher number = higher priority)
  queue.add(taskFactory(1, 1000), 1).then(res => console.log(`Result: ${res}`)).catch(console.error);
  queue.add(taskFactory(2, 500), 5).then(res => console.log(`Result: ${res}`)).catch(console.error);
  queue.add(taskFactory(3, 700), 3).then(res => console.log(`Result: ${res}`)).catch(console.error);
  queue.add(taskFactory(4, 300), 10).then(res => console.log(`Result: ${res}`)).catch(console.error);

  // You can pause/resume the queue manually as well
  // queue.pause();
  // setTimeout(() => queue.resume(), 2000);
}

main();
