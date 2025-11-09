import React from 'react';
import styles from '@styles/Editor.module.css';
import Editor from '../../layerhub-editor';
import { RootAppContext } from '../../context/RootAppContext';
import { GetServerSideProps } from 'next';
import { supabase } from '@supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

interface EditorPageProps {
    user: User;
}

export default function EditorPage({ user }: EditorPageProps) {
    const router = useRouter();
    const { id } = router.query;
    const context = {
        id: id as string,
        user
    }
    return (
        <RootAppContext.Provider value={context}>
            <div className={styles.editor}>
                <Editor />
            </div>
        </RootAppContext.Provider>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) {
        return { props: {}, redirect: { destination: '/login' } };
    }

    return { props: { user } };
}