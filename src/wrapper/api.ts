import { GetPageResponse } from '@notionhq/client/build/src/api-endpoints';
import { Task } from '@/models/project';

// eslint-disable-next-line import/prefer-default-export
export const getTasks = async () => {
  const tasks = (await ((await fetch('/api/getPages', {
    method: 'POST',
    body: JSON.stringify({
      type: 'tasks',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })).json())).results as GetPageResponse[];

  console.log('tasks', tasks);
  const blocksTasks: (() => Promise<any>)[] = [];

  tasks.forEach(async (task) => {
    blocksTasks.push(async () => {
      const blocks = (await ((await fetch('/api/getPageDetails', {
        method: 'POST',
        body: JSON.stringify({
          page: task.id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })).json()));

      return blocks;
    });
  });

  const taskBlocsResult = await Promise.all(blocksTasks.map((x) => x()));

  return tasks.map((p, index) => {
    const myTask: Partial<Task> = {};

    myTask.id = p.id;
    myTask.name = p.properties.Name.title[0].text.content;
    myTask.project = p.properties.Project.relation[0].id;
    myTask.status = p.properties.Status.select?.id ?? null;
    myTask.tags = p.properties.Tags.multi_select.map((tag) => tag.id);
    myTask.content = taskBlocsResult[index].results;

    return new Task(myTask);
  });
};
