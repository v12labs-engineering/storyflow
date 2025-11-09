import React, {useState, useEffect} from 'react';
import Button from '@components/Button';
import Input from '@components/Input';
import { supabase } from '@supabase/client';
import { toast } from 'react-toastify';
import styles from './LandingPageInput.module.css';

export default function LandingPageInput() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (email: string) => {
        try {
            setLoading(true)
            const { user, session, error } = await supabase.auth.signIn({ email }, {
                redirectTo: window.location.origin
            });

            if (error) {
                toast('Something went wrong. Please try again', { type: 'error' });
            } else {
                toast('Please check your inbox/spam folders in email for magic link to login', { type: 'success' });
            }
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    function onSubmit(e: any) {
        e.preventDefault(); 
        email && handleLogin(email);
    }

    return (
        <form onSubmit={onSubmit} className={styles.container}>
            <Input
                type="email"
                icon="mail"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
            <Button
                size="medium"
                type="submit"
                disabled={loading}>
                <span>{loading ? 'Sending...' : 'Create a story'}</span>
            </Button>
        </form>
    );
}