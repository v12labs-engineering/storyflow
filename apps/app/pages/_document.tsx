import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import React from 'react';
import { Provider as StyletronProvider } from 'styletron-react';
import { styletron } from '../styletron';

class MyDocument extends Document {
  static async getInitialProps(context: DocumentContext) {
    // const initialProps = await Document.getInitialProps(ctx)
    // return initialProps;
    const renderPage = () =>
      context.renderPage({
        enhanceApp: (App) => (props) =>
        (
          <StyletronProvider value={styletron}>
            <App {...props} />
          </StyletronProvider>
        ),
      });

    const initialProps = await Document.getInitialProps({
      ...context,
      renderPage,
    });

    const stylesheets = styletron.getStylesheets() || [];
    return { ...initialProps, stylesheets };
  }

  render() {
    return (
      <Html>
        <Head>
          {/* <meta charSet="utf-8" />
          <meta name="keywords" content="stories, web stories, video" />
          <meta name="author" content="Sharath Challa" />
          <meta httpEquiv="Content-Language" content="en" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Add interactive web stories to your website with just few bytes of JavaScript.
            Web stories is a way to reach a unique audience within a new storytelling experience. Storyflow integration supercharges your user experience with a floating stories widget." />
          <meta property="og:title" content="Storyflow" />
          <meta property="og:description" content="Add interactive web stories to your website with just few bytes of JavaScript.
          Web stories is a way to reach a unique audience within a new storytelling experience. Storyflow integration supercharges your user experience with a floating stories widget." />
          <meta property="og:image" content="/storyflow-meta.svg" />
          <meta property="og:url" content="https://storyflow.video" /> */}
          <link rel="icon" href="/storyflow-favicon.svg" />
          <link rel="apple-touch-icon" href="/storyflow-favicon.svg" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Outfit&display=swap" rel="stylesheet" />
          {this.props.stylesheets.map((sheet, i) => (
            <style
              className="_styletron_hydrate_"
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
              key={i}
            />
          ))}
          <script src="./crisp.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument