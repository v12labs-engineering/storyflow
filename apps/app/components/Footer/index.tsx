/* eslint-disable @next/next/no-img-element */
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      &copy; 2022 &nbsp; | &nbsp; Storyflow
      {/* <a href="https://www.producthunt.com/posts/storyflow?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-storyflow" target="_blank" rel="noreferrer">
        <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=324939&theme=light" alt="Storyflow - A simple web story CMS platform | Product Hunt" width="200" height="44" />
      </a> */}
    </footer>
  )
}