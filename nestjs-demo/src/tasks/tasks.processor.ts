import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('tasks')
export class TasksProcessor extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    console.log('Processing job:', job.name, job.data);

    if (job.name === 'create-task') {
      return {
        status: 'done',
        message: `Task processed: ${job.data.title}`,
      };
    }

    return { status: 'unknown job' };
  }
}