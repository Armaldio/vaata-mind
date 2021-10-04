import { VercelRequest, VercelResponse } from '@vercel/node';
import notion, { findTableId } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  await notion.databases.update({
    database_id: findTableId('projects'),
    properties: {
      Name: {
        type: 'title',
        title: {},
      },
      Description: {
        type: 'rich_text',
        name: 'Description',
        rich_text: {},
      },
    },
  });

  await notion.databases.update({
    database_id: findTableId('tasks'),
    properties: {
      Name: {
        type: 'title',
        title: {},
      },
      Description: {
        type: 'rich_text',
        name: 'Description',
        rich_text: {},
      },
      Status: {
        type: 'select',
        name: 'Status',
        select: {
          options: [
            {
              name: 'Todo',
            },
            {
              name: 'Doing',
            },
            {
              name: 'Done',
            },
          ],
        },
      },
      Tags: {
        type: 'multi_select',
        name: 'Tags',
        multi_select: {},
      },
      Project: {
        type: 'relation',
        name: 'Project',
        relation: {
          database_id: findTableId('projects'),
        },
      },
    },
  });

  await notion.databases.update({
    database_id: findTableId('notes'),
    properties: {
      Name: {
        type: 'title',
        title: {},
      },
      Project: {
        type: 'relation',
        name: 'Project',
        relation: {
          database_id: findTableId('projects'),
        },
      },
      Content: {
        type: 'rich_text',
        name: 'Content',
        rich_text: {},
      },
    },
  });

  return res.json({});
};
