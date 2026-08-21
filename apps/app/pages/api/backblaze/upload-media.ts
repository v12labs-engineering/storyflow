import type { NextApiRequest, NextApiResponse } from 'next';
import b2 from '@backblaze/client';
import { v4 as uuidv4 } from 'uuid';
import { requireMatchingUser } from '@lib/api-auth';

const MAX_FILE_BYTES = 15_000_000;
const ALLOWED_MEDIA_TYPES = new Set([
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
]);

export const config = {
    api: {
        bodyParser: false,
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).send({ error: 'Method not allowed' });
        }

        const id = await requireMatchingUser(req, res);
        if (!id) {
            return;
        }

        const contentType = req.headers['content-type']?.split(';')[0];
        if (!contentType || !ALLOWED_MEDIA_TYPES.has(contentType)) {
            return res.status(415).send({ error: 'Unsupported media type' });
        }

        const contentLength = Number(req.headers['content-length'] ?? 0);
        if (contentLength > MAX_FILE_BYTES) {
            return res.status(413).send({ error: 'File size should not exceed 15 MB.' });
        }

        // reconstruct file buffer from stream
        const file: Buffer = await new Promise((resolve) => {
            const chunks: any[] = [];

            req.on('readable', () => {
                let chunk;

                while (null !== (chunk = req.read())) {
                    chunks.push(chunk);
                }
            });

            req.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        });

        if (file.length > MAX_FILE_BYTES) {
            return res.status(413).send({ error: 'File size should not exceed 15 MB.' });
        }

        // must authorize first (authorization lasts 24 hrs)
        await b2.authorize();

        // get bucket details
        const { data: { buckets } } = await b2.getBucket({
            bucketName: 'storyflow-media',
        });

        // get upload url and metadata
        const { data: { authorizationToken, uploadUrl } } = await b2.getUploadUrl({ bucketId: buckets[0].bucketId });

        // upload file to B2
        b2.uploadFile({
            uploadUrl: uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName: uuidv4(),
            mime: contentType,
            data: file,
            contentLength: file.length,
            onUploadProgress: (event: any) => {
                console.log(`Uploaded ${event.loaded} bytes`);
            }
        }).then(({ data }) => {
            res.status(200).json({
                message: 'Successfully uploaded file',
                fileUrl: `https://storyflow-media.s3.us-west-002.backblazeb2.com/${data.fileName}`,
                fileName: data.fileName,
                fileId: data.fileId,
                fileInfo: data.fileInfo,
            });
            res.end();
        }).catch((err: any) => {
            res.status(500).send({
                error: err.message || 'Failed to upload file.'
            });
        });
    } catch (err: any) {
        res.status(500).send({
            error: err.message || 'Unknown exception occured while uploading file.'
        });
    }
}
