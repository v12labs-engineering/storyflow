import type { NextApiRequest, NextApiResponse } from 'next';
import b2 from '@backblaze/client';
import generateAMPhtml from '@lib/generateAMPhtml';
import { requireMatchingUser } from '@lib/api-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).json({ error: 'Method not allowed' });
        }

        const id = await requireMatchingUser(req, res);
        if (!id) {
            return;
        }

        const html = await generateAMPhtml(id);

        // must authorize first (authorization lasts 24 hrs)
        await b2.authorize();

        // get bucket details
        const { data: { buckets } } = await b2.getBucket({
            bucketName: 'storyflow',
        });

        // get upload url and metadata
        const { data: { authorizationToken, uploadUrl } } = await b2.getUploadUrl({ bucketId: buckets[0].bucketId });

        // upload file to B2
        b2.uploadFile({
            uploadUrl: uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName: `${id}.html`,
            mime: 'text/html',
            data: Buffer.from(html),
            onUploadProgress: (event: any) => {
                console.log(`Uploaded ${event.loaded} bytes`);
            }
        }).then(() => {
            res.status(200).json({
                message: 'Successfully uploaded file',
            });
            res.end();
        }).catch((err: any) => {
            res.status(500).json({
                message: 'Failed to upload file',
                error: err
            });
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to upload file',
            error: err
        });
    }
}
