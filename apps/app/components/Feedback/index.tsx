import styles from './Feedback.module.css';
import Input from '@components/Input';
import TextArea from '@components/TextArea';
import Button from '@components/Button';
import Icon from '@components/Icon';
import { useState } from 'react';
import { supabase } from '@supabase/client';
import { toast } from 'react-toastify';

export default function Feedback() {
    const [save, setSave] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [emoji, setEmoji] = useState<'heart' | 'thumbs-up' | 'thumbs-down'>('heart');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email) {
            setSave(true);
            const { data, error } = await supabase
                .from('feedback')
                .insert([
                    {
                        email,
                        message,
                        emoji
                    },
                ]);
            setSave(false);
            if (error) {
                console.error(error);
            }
            if (data) {
                toast.success('Thank you for your feedback!');
            }
        }
    };

    return (
        <div className={styles.feedback}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input icon={'mail'}
                    placeholder="Your email address..."
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
                <TextArea placeholder="Your message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)} />
                <div className={styles.footer}>
                    <div className={styles.emojis}>
                        <Icon type="heart" size={emoji === 'heart' ? 32 : 24} onClick={() => setEmoji('heart')} />
                        <Icon type="thumbs-up" size={emoji === 'thumbs-up' ? 32 : 24} onClick={() => setEmoji('thumbs-up')} />
                        <Icon type="thumbs-down" size={emoji === 'thumbs-down' ? 32 : 24} onClick={() => setEmoji('thumbs-down')} />
                    </div>
                    <Button type="submit">{save ? 'Sending...' : 'Send'}</Button>
                </div>
            </form>
        </div>
    )
}