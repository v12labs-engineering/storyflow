import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { supabase } from '@supabase/client';
import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
    methods: ['GET']
});

const withCors = (handlerFn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req)
    return await cors(req, res, async () => {
        await handlerFn(req, res);
    });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;
    if (userId) {
        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .eq('user_id', userId);
        if (error) {
            res.status(400).json(error);
        } else {
            res.status(200).json(data);
        }
    } else {
        res.status(400).json({ error: 'No stories available for the user' });
    }
}

export default withCors(handler);