import styles from '@styles/Profile.module.css';
import { useState, useEffect } from 'react';
import { supabase } from '@supabase/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Button from '@components/Button';
import { User } from '@supabase/supabase-js';

const Profile: NextPage = () => {
    const [profile, setProfile] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchProfile() {
            const profileData: (User | null) = await supabase.auth.user();
            if (!profileData) {
                router.push('/');
            } else {
                setProfile(profileData);
            }
        }
        fetchProfile();
    }, [router]);

    async function signOut() {
        await supabase.auth.signOut();
        router.push('/');
    }

    if (!profile) return null;

    return (
        <div className={styles.profile}>
            <Image src="/personal-info.svg" alt="Storyflow illustration" width={650} height={400} />
            <div>
                <h2>Hello, {profile.email}</h2>
                <Button size="large" onClick={signOut}>Logout</Button>
            </div>
        </div>
    )
}

export default Profile;