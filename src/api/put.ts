import { VercelRequest, VercelResponse } from '@vercel/node';
import notion from './notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const dbs = await notion.search({
    query: '',
  });

  console.log('dbs', dbs);

  res.json(dbs);
};
