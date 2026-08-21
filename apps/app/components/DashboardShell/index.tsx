/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import Icon from '@components/Icon';
import styles from './DashboardShell.module.css';

interface DashboardShellProps {
  children: React.ReactNode;
  email?: string;
}

const navigation = [
  { label: 'Overview', icon: 'home', href: '/stories#performance' },
  { label: 'Stories', icon: 'book-open', href: '/stories' },
  { label: 'Media', icon: 'image', href: '/stories#media' },
  { label: 'Integrations', icon: 'settings', href: '/stories#integrations' },
  { label: 'Analytics', icon: 'bar-chart-2', href: '/stories#performance' },
];

export default function DashboardShell({ children, email }: DashboardShellProps) {
  const router = useRouter();
  const isStories = router.pathname === '/stories' || router.pathname === '/create';

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Storyflow workspace navigation">
        <Link href="/stories">
          <a className={styles.brand} aria-label="Storyflow stories home">
            <img src="/storyflow-logo.svg" alt="Storyflow" width="128" height="52" />
          </a>
        </Link>
        <nav className={styles.nav} aria-label="Workspace">
          {navigation.map((item) => (
            <Link href={item.href} key={item.label}>
              <a aria-label={item.label} className={`${styles.navItem} ${item.label === 'Stories' && isStories ? styles.active : ''}`}>
                <Icon type={item.icon} size={20} />
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
        <div className={styles.account}>
          <span className={styles.avatar} aria-hidden="true">SD</span>
          <span className={styles.accountCopy}>
            <strong>Sarah Demo</strong>
            <small>Acme Cloud</small>
          </span>
          <Icon type="chevron-down" size={17} />
        </div>
      </aside>
      <div className={styles.mobileHeader}>
        <Link href="/stories"><a><img src="/storyflow-logo.svg" alt="Storyflow" width="110" height="44" /></a></Link>
        <span className={styles.avatar} aria-label={email || 'Sarah Demo'}>SD</span>
      </div>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
