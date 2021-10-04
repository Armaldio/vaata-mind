import { VercelRequest, VercelResponse } from '@vercel/node';
import notion from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const dbs = await notion.search({});

  console.log('dbs', dbs);

  return res.json(dbs);
};
