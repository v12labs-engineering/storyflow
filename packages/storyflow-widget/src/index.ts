import { createElement, removeElementbyId, loadJS, createImage, loadCSS } from './dom';
import storyflowImg from '../assets/storyflow.svg';

interface Media {
    name: string,
    description: string,
    type: string,
    url: string,
    media_id: string,
    user_id: string
}

let media: Media[] = [];

function getUserId(): string {
    const script = document.getElementById('storyflow-script');
    return script?.getAttribute("data-storyflow-user") || 'c9477f1b-ab00-40f9-8bd5-fe590fff1ddd';
}

async function getStories(): Promise<string[]> {
    const stories = await fetch(`https://app.storyflow.video/api/stories/${getUserId()}`);
    return await stories.json();
}

// create globalWrapper div
const globalWrapper = <HTMLDivElement>createElement({
    attributes: {
        class: 'globalWrapper'
    },
    styles: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        cursor: 'pointer',
        width: '50px',
        height: '50px',
        padding: '1px',
        margin: '10px',
        boxShadow: '0px 8px 16px 0px',
        borderRadius: '50%',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: '#ff7e1d',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    eventHandlers: {
        click: (e: MouseEvent) => {
            openStories();
        }
    }
});
globalWrapper.appendChild(createImage(storyflowImg));

const iframe = <HTMLIFrameElement>createElement({
    type: 'iframe',
    attributes: {
        id: 'storyflow-iframe',
        name: 'storyflow-iframe',
        frameborder: '0',
        sandbox: 'allow-presentation allow-popups-to-escape-sandbox allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation'
    },
    styles: {
        bottom: '0',
        left: '0',
        overflow: 'hidden',
        position: 'fixed',
        zIndex: 99999
    }
});

iframe.onload = () => {
    getStories()
        .then((res: any) => {
            media = res;
            init();
        })
        .catch(err => console.log(err));
}

// create overlay
function createOverlay(): HTMLDivElement {
    const storyPlayerLinks = media.filter(m => m.type === 'amp-story');
    // merge stories with preview link
    storyPlayerLinks.push({
        name: 'Storyflow',
        description: 'Storyflow',
        type: 'amp-story',
        url: `https://f002.backblazeb2.com/file/storyflow/${getUserId()}.html`,
        media_id: '',
        user_id: getUserId()
    });

    const overlayContainer = <HTMLDivElement>createElement({
        attributes: {
            class: 'overlay',
            id: 'overlay'
        },
        styles: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        innerHTML: `
            <amp-story-player id="amp-player" layout="fill">
                <script type="application/json">
                    {
                        "controls": [
                            {
                                "name": "close",
                                "position": "end"
                            },
                            {
                                "name": "skip-to-next"
                            }
                        ]
                    }
                 </script>
                 <style amp-custom>
                    @keyframes ripple-loader {
                        0% {
                            top: 32px;
                            left: 32px;
                            width: 0;
                            height: 0;
                            opacity: 1;
                        }
                        100% {
                            top: 0;
                            left: 0;
                            width: 64px;
                            height: 64px;
                            opacity: 0;
                        }
                    }
                    .rect {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        aspect-ratio: 9 / 16;
                        height: 680px;
                        width: 400px;
                        border-radius: 25px;
                        background: rgba(0, 0, 0, 0.8)
                    }
                    .ripple-loader {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        width: 64px;
                        height: 64px;
                    }
                    .ripple-loader div {
                        position: absolute;
                        border: 4px solid #ff7e1d;
                        border-radius: 50%;
                        animation: ripple-loader 1s ease-out infinite;
                    }
                    .ripple-loader div:nth-child(2) {
                        animation-delay: -0.5s;
                    }
                </style>
                ${storyPlayerLinks.map(stories => `
                    <a href="${stories.url}"></a>
                `).join('')}
                <div class="rect" amp-story-player-poster-img>
                    <div class="ripple-loader">
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </amp-story-player>
        `
    });
    return overlayContainer;
}

// play stories
function openStories(): void {
    if (document.getElementById('overlay')) {
        return;
    }
    removeElementbyId('overlay');
    const overlay = createOverlay();

    setTimeout(() => {
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.contentWindow?.document.body.appendChild(overlay);
        const player = iframe.contentWindow?.document.getElementById('amp-player');
        player?.addEventListener('amp-story-player-close', () => {
            iframe.contentWindow?.document.getElementById('overlay')?.remove();
            iframe.width = '';
            iframe.height = '';
        });
        player?.addEventListener('ready', () => {
            console.log('Player is ready!!');
        });
    }, 0);
}

// start from here
function init(): void {
    setTimeout(() => {
        if (iframe.contentWindow) {
            loadJS('https://cdn.ampproject.org/v0.js', iframe.contentWindow.document);
            loadJS('https://cdn.ampproject.org/v0/amp-story-player-0.1.js', iframe.contentWindow.document);
            // loadCSS('https://cdn.ampproject.org/amp-story-player-v0.css', iframe.contentWindow.document);

            // fix: https://groups.google.com/g/amphtml-discuss/c/88Kti6QNCLQ?pli=1
            iframe.contentWindow.document.write('<span></span>');
            iframe.contentWindow.document.body.appendChild(globalWrapper);
        }
    }, 0);

}

// onload init
window.addEventListener('load', function () {
    document.body.appendChild(iframe);
});