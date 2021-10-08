import { VercelRequest, VercelResponse } from '@vercel/node';
import notion, { findTableId } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const id = findTableId(req.body.type);

  const db = await notion.databases.query({
    database_id: id,
  });

  return res.json(db);
};
