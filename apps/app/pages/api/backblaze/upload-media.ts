import type { NextApiRequest, NextApiResponse } from 'next';
import b2 from '@backblaze/client';
import { v4 as uuidv4 } from 'uuid';

export const config = {
    api: {
        bodyParser: false,
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // get user Id
        const { id } = req.query;
        if (!id) {
            throw new Error('No user id provided');
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

        if (file && file.length > 15000000) {
            throw new Error('File size should not exceed 15 MB.');
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
            mime: req.headers['content-type'] as string,
            data: file,
            contentLength: 15000000,
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