import Script from 'next/script';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Image from 'next/image';
import styles from './Layout.module.css';
import { useState, useEffect } from 'react';
import { supabase } from '@supabase/client';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const [authenticatedState, setAuthenticatedState] = useState<string>('not-authenticated');
  const [userEmail, setUserEmail] = useState<string>();
  const [isEditor, setIsEditor] = useState<boolean>();

  useEffect(() => {
    /* fires when a user signs in or out */
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      onAuthChange(event, session);
      if (event === 'SIGNED_IN') {
        setAuthenticatedState('authenticated');
        // router.push('/');
      }
      if (event === 'SIGNED_OUT') {
        setAuthenticatedState('not-authenticated');
        router.push('/login');
      }
    });

    checkUser();

    if (router && router.asPath.includes('editor')) {
      setIsEditor(true);
    }

    return () => {
      authListener && authListener.unsubscribe();
    }
  }, [router]);

  async function checkUser() {
    /* when the component loads, checks user to show or hide login link */
    const user = await supabase.auth.user();
    if (user) {
      setAuthenticatedState('authenticated');
      setUserEmail(user.email);
    }
  }

  async function onAuthChange(event: any, session: any) {
    /* sets and removes the Supabase cookie */
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    })
  };

  return (
    <>
      {!isEditor && (
        <div className={styles.layout}>
          <title>Storyflow</title>
          <Header authState={authenticatedState} email={userEmail} />
          <main className={styles.main}>
            <div className={styles.container}>
              {children}
            </div>
          </main>
          <ToastContainer toastClassName={styles.toastify} />
          <Footer />
          <div className={styles.tryIt}>
            <Image src="/try-it-out.svg" alt="try it out" width={100} height={100} />
          </div>
          <Script id="storyflow-script" src={process.env.NEXT_PUBLIC_STORYFLOW_WIDGET} />
        </div>
      )}
      {isEditor && children}
    </>
  )
}