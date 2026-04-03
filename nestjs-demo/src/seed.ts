import { AppDataSource } from './data-source';
import { Task } from './tasks/task.entity';

async function seed() {
  await AppDataSource.initialize();

  const taskRepository = AppDataSource.getRepository(Task);

  const sampleTasks = [
    { title: 'Morning routine' },
    { title: 'Exercise habit' },
    { title: 'Review app settings' },
  ];

  for (const task of sampleTasks) {
    const exists = await taskRepository.findOneBy({ title: task.title });

    if (!exists) {
      const newTask = taskRepository.create(task);
      await taskRepository.save(newTask);
    }
  }

  console.log('Seeding completed');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
});