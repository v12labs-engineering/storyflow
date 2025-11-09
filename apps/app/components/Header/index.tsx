/* eslint-disable @next/next/no-img-element */
import styles from './Header.module.css';
import Feedback from '@components/Feedback';
import MenuIcon from '@components/MenuIcon';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  authState?: string;
  email?: string;
}

export default function Header({ authState, email }: HeaderProps) {
  const [toggle, setToogle] = useState<boolean>(false);
  const toggleResponsive = () => setToogle(!toggle);

  return (
    <header className={styles.header}>
      <div className={styles.menu}>
        <MenuIcon className={styles.menuIcon} onClick={toggleResponsive} />
      </div>
      <div className={styles.logo}>
        <Link href="/" passHref>
          <img src="/storyflow-logo.svg" alt="logo" height={50} width={120} />
        </Link>
      </div>
      <nav className={`${!toggle ? styles.nav : styles.responsive}`}>
        <ul className={styles.navList}>
          {authState === 'authenticated' ? (
            <li className={styles.navItem}>
              <Link href="/stories">
                <a>Your Stories</a>
              </Link>
            </li>
          ) : null}
          <li className={styles.navItem}>
            <a target="_blank" rel="noreferrer" href="https://amp.dev/documentation/tools/?format=stories">Tools</a>
          </li>
          <li className={styles.navItem}>
            <a href="https://calendly.com/src200" target="_blank" rel="noreferrer">Schedule a demo</a>
          </li>
          <li className={styles.navItem}>
            <a className={styles.feedbackItem}>Feedback</a>
            <div className={styles.feedbackForm}>
              <Feedback />
            </div>
          </li>
        </ul>
      </nav>
      {authState === 'authenticated' ? (
        <div className={styles.profile}>
          <Link href="/profile">
            <a>
              <img height={45} width={45} alt="Avatar" src={encodeURI(`https://robohash.org/${email}`)} />
            </a>
          </Link>
        </div>) : (
        <div className={styles.login}>
          <Link href="/login">
            Login
          </Link>
        </div>
      )}
    </header>
  )
}