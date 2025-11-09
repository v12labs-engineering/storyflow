import type { NextApiRequest, NextApiResponse } from 'next';
import { getFileData } from '../backblaze/read';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const data = await getFileData(id as string);
        res.setHeader(
            'Content-Type', 'text/html'
        );
        res.status(200).send(data);
    } catch (err) {
        res.status(500).json({ err });
    }
}