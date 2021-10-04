import { VercelRequest, VercelResponse } from '@vercel/node';
import notion, { findTableId } from '../src/api/notion';

export default async (req: VercelRequest, res: VercelResponse) => res.json({});
