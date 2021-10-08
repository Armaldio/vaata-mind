import { VercelRequest, VercelResponse } from '@vercel/node';
import notion, { findTableId } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => {
  const db = await notion.blocks.children.list({
    block_id: req.body.page,
  });

  return res.json(db);
};
