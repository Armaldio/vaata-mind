import { VercelRequest, VercelResponse } from '@vercel/node';
import createNotion, { findTableId } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const id = findTableId(req.body.type);

  const db = await createNotion.databases.retrieve({
    database_id: id,
  });

  return res.json(db);
};
