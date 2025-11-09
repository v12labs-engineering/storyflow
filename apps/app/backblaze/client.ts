import B2 from 'backblaze-b2';

const b2 = new B2({
    applicationKeyId: process.env.BACKBLAZE_APP_ID as string,
    applicationKey: process.env.BACKBLAZE_APP_KEY as string
});

export default b2;