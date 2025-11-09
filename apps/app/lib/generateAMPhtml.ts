import { supabase } from '@supabase/client';

const AMP_HTML = (stories: string) => `
    <!DOCTYPE html>
    <html amp lang="en">
        <head>
            <meta charset="utf-8" />
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
            <script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"></script>
            <script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"></script>
            <title>Storyflow Preview</title>
            <link rel="canonical" href="" />
            <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
            <noscript>
                <style amp-boilerplate>
                    body {
                        -webkit-animation: none;
                        -moz-animation: none;
                        -ms-animation: none;
                        animation: none;
                    }
                </style>
            </noscript>
        </head>
        <body>
            ${stories}
        </body>
    </html>`;

function generatePageOutLinks(url: string, text: string = 'Read more'): string | null {
  if (!url) return null;
  return `<amp-story-page-outlink layout="nodisplay">
          <a href="${url}" target="_blank">
            ${text}
          </a>
        </amp-story-page-outlink>`;
}

// generate story extension markup based on media type
export function generateStoryExtensionMarkUp(media: any): string {
  let storyMarkup = '';

  switch (media.type) {
    case 'video':
    case 'upload-video':
      storyMarkup = `
          <amp-video
            layout="responsive"
            src="${media.url}"
            height="480"
            width="270"
            autoplay>
          </amp-video>
        `;
      break;
    case 'image':
    case 'upload-image':
      storyMarkup = `
          <amp-img
            src="${media.url}"
            height="480"
            width="270"
            layout="responsive">
          </amp-img>
        `;
      break;
    case 'youtube':
      storyMarkup = `
          <amp-youtube
            data-videoid="${media.media_id}"
            layout="responsive"
            width="480"
            height="270">
          </amp-youtube>
        `;
      break;
    case 'instagram':
      storyMarkup = `
          <amp-instagram
            data-shortcode="${media.media_id}"
            layout="responsive"
            width="480"
            height="270">
          </amp-instagram>
        `;
      break;
    case 'twitter':
      storyMarkup = `
          <amp-twitter
            data-tweetid="${media.media_id}"
            layout="responsive"
            width="480"
            height="270">
          </amp-twitter>
        `;
      break;
    case 'amp-story':
      storyMarkup = `
          <a href="${media.url}" />
        `;
      break;
    default:
      break;
  }
  return storyMarkup;
}

export default async function generateAMPhtml(userId: string) {
  const { data } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId);

  const storyExtensionsLinks = data?.filter(m => m.type !== 'amp-story');

  const ampStory = `
            <amp-story standalone
                title="Storyflow AMP"
                publisher="Storyflow">
                ${storyExtensionsLinks?.map((extensionStories, index) => `
                <amp-story-page id="${index}">
                    <amp-story-grid-layer template="fill">
                        ${generateStoryExtensionMarkUp(extensionStories)}
                    </amp-story-grid-layer>
                    ${generatePageOutLinks(extensionStories.cta_link, extensionStories.cta_text)}
                </amp-story-page>`)}
            </amp-story>`;

  return AMP_HTML(ampStory);
}