const AMP_HTML = (storyPlayer: string) => `
    <!DOCTYPE html>
    <html amp lang="en">
        <head>
            <meta charset="utf-8" />
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async src="https://cdn.ampproject.org/v0/amp-story-player-0.1.js"></script>
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
                        .i-amphtml-story-player-loaded::after {
                           display: none
                        }
                    }
                </style>
            </noscript>
        </head>
        <body>
            ${storyPlayer}
        </body>
    </html>`;

export default function previewAMPhtml(images: Array<string>) {
    const ampStory =
        `
            <amp-story standalone
                title="Storyflow AMP"
                publisher="Storyflow">
                ${images?.map((image, index) => `
                    <amp-story-page id="${index}">
                        <amp-story-grid-layer template="fill">
                            <amp-img
                                src="${image}"
                                height="480"
                                width="270"
                                layout="responsive">
                             </amp-img>
                        </amp-story-grid-layer>
                    </amp-story-page>
                    `
        )}
            </amp-story>
        `;

    // const ampStoryPlayer =
    //     `
    //         <amp-story-player id="amp-player" layout="fill">
    //             ${ampStory}
    //         </amp-story-player>
    //     `;

    return AMP_HTML(ampStory);
}