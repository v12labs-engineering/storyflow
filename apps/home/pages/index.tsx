import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Storyflow</title>
        <meta name="description" content="Storyflow app" />
        <link rel="icon" href="/storyflow-favicon.svg" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://storyflow.video">Storyflow</a>
        </h1>

        <p className={styles.description}>
          This page is currently under development, to provide new experiences.
        </p>

        <div className={styles.grid}>
          <a href="https://app.storyflow.video" className={styles.card}>
            <h2>Continue to use old app &rarr;</h2>
            <p>Please use older version.</p>
          </a>

          <a href="mailto:hello@storyflow.video" className={styles.card}>
            <h2>Contact us &rarr;</h2>
            <p>Please contact us in case of any queries.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
