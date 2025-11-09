import type { NextApiRequest, NextApiResponse } from 'next';
import b2 from '@backblaze/client';

export async function getFileData(id: string) {
    try {
        // must authorize first (authorization lasts 24 hrs)
        await b2.authorize();

        const { data } = await b2.downloadFileByName({
            bucketName: "storyflow",
            fileName: `${id}.html`,
            responseType: 'blob',
            onDownloadProgress: (progress: any) => {
                console.log(progress);
            }
        });
        return data;
    } catch (error) {
        return error;
    }

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // get user Id
        const { id } = req.query;
        if (!id) {
            throw new Error('No user id provided');
        }

        const data = await getFileData(id as string);
        res.status(200).send(data);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to upload file',
            error: err
        });
    }
}