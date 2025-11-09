import { supabase } from '@supabase/client';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import styles from '@styles/Stories.module.css';
import Button from '@components/Button';
import Icon from '@components/Icon';
import Card from '@components/Card';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { CopyBlock, atomOneLight } from "react-code-blocks";
import React from 'react';
import { useRouter } from 'next/router';

interface StoryProps {
    user: User;
}

interface Story {
    id: string;
    name: string;
    description: string;
    url: string;
    user_id: string;
}

export default function Stories({ user }: StoryProps) {
    const [fetching, setFetching] = useState<boolean>(false);
    const [stories, setStories] = useState<Story[]>([]);
    const router = useRouter();

    const fetchStories = async () => {
        setFetching(true);
        setStories([]);
        const { data, error } = await supabase.from('stories').select('*').match({ user_id: user.id });

        if (data) {
            setStories(data);
        } else {
            error && console.error(error);
        }
        setFetching(false);
    };

    const removeStory = async (story_id: string) => {
        const { data, error } = await supabase.from('stories').delete().match({ id: story_id });
        if (data) {
            await fetch(`/api/backblaze/upload?id=${user.id}`);
            fetchStories();
            toast('Removed story successfully!', { type: 'success' });
        }
        if (error) {
            console.error(error);
            toast('Something went wrong. Please try again!', { type: 'error' });
        }
    };

    // const updateStory = async (story_id: string, name: string, description: string, url: string) => {
    //     const { data, error } = await supabase.from('stories').update({ name, description, url }).match({ id: story_id });
    //     if (error) {
    //         console.error(error);
    //     }
    // };

    useEffect(() => {
        fetchStories();
    }, []);

    return (
        <div className={styles.storiesContainer}>
            <div className={styles.storiesHead}>
                <h2 className={styles.title}>Your Stories</h2>
                <Link href='/create' passHref>
                    <Button size='large'>
                        <Icon type="plus-circle" />
                        Add stories
                    </Button>
                </Link>
            </div>
            {fetching && <p>Fetching user stories...</p>}
            {!fetching && stories.length <= 0 && <p>No stories found! Please add stories by clicking Add stories button.</p>}
            <div className={styles.stories}>
                {stories.map((story) => (
                    <Card key={story.id}
                        title={story.name}
                        description={story.description}
                        url={story.url}
                        id={story.id}
                        cardActions={[
                            { name: 'Edit', action: () => router.push(`editor/${story.id}`) },
                            { name: 'Delete', action: () => removeStory(story.id) },
                        ]} />
                ))}
            </div>
            <div className={styles.integration}>
                <h2 className={styles.title}>Integration Script</h2>
                <p>
                    To get the Storyflow widget to appear on your web app simply copy and paste the snippet
                    below before the body tag on every page where you want the Storyflow widget to appear for website visitors.
                </p>
                <div className={styles.codeBlock}>
                    <CopyBlock
                        text={
                            `
    <script type="text/javascript" async id="storyflow-script" src="${process.env.NEXT_PUBLIC_STORYFLOW_WIDGET}" data-storyflow-user="${user.id}" />
                            `
                        }
                        language='javascript'
                        showLineNumbers={false}
                        theme={atomOneLight}
                        codeBlock
                    />
                </div>
            </div>
        </div >
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) {
        return { props: {}, redirect: { destination: '/login' } };
    }

    return { props: { user } };
}