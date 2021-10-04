import { VercelRequest, VercelResponse } from '@vercel/node';
import notion, { findTableId } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const id = findTableId(req.body.type);

  const dbs = await notion.databases.update({
    database_id: id,
    properties: req.body.properties,
  });

  return res.json(dbs);
};
