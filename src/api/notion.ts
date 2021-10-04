import { Client } from '@notionhq/client';

const types = {
  projects: process.env.NOTION_PROJECTS,
  notes: process.env.NOTION_NOTES,
  tasks: process.env.NOTION_TASKS,
};

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export default notion;

export function findTableId(type: keyof typeof types) {
  return types[type];
}
