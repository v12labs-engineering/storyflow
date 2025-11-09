import type { NextPage } from 'next';
import { useState } from 'react';
import { supabase } from '@supabase/client';
import Button from '@components/Button';
import Input from '@components/Input';
import Icon from '@components/Icon';
import Image from 'next/image';
import { toast } from 'react-toastify';
import styles from '@styles/Login.module.css';

const Login: NextPage = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const notify = () => toast("Wow so easy!");

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

    return (
        <div className={styles.login}>
            <Image src="/welcome.svg" alt="Storyflow welcome cats" width={500} height={300} />
            <div className={styles.loginForm}>
                <h3 className={styles.formLabel}>
                    <Icon type="user" size={28} /> Login
                </h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    email && handleLogin(email);
                }}>
                    <div className={styles.emailInput}>
                        <Input
                            type="email"
                            icon="mail"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.loginButton}>
                        <Button
                            size="large"
                            type="submit"
                            disabled={loading}>
                            <span>{loading ? 'Sending...' : 'Send magic link'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;