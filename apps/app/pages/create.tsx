import Input from '@components/Input';
import Button from '@components/Button';
import Icon from '@components/Icon';
import Select from '@components/Select';
import { supabase } from '@supabase/client';
import { GetServerSideProps } from 'next';
import React, { useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import styles from '@styles/Create.module.css';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getYoutubeId } from '@utils/index';

interface CreateProps {
    user: User;
}

interface MediaOptions {
    readonly value: string;
    readonly label: string;
    readonly placeholder: string;
}

export default function Create({ user }: CreateProps) {
    const router = useRouter();
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [storyUrl, setStoryUrl] = useState<string>('');
    const [selectedMediaOption, setSelectedMediaOption] = useState<MediaOptions>();
    const [ctaLink, setCtaLink] = useState<string>('');
    const [ctaText, setCtaText] = useState<string>('');
    let mediaId = '';

    const mediaOptions: MediaOptions[] = [
        { value: 'amp-story', label: 'Story url', placeholder: 'Paste existing story url' },
        { value: 'image', label: 'Image url', placeholder: 'Paste Image link' },
        { value: 'upload-image', label: 'Upload an image', placeholder: 'Upload an image' },
        { value: 'video', label: 'Video url', placeholder: 'Paste Video link' },
        { value: 'upload-video', label: 'Upload a video', placeholder: 'Upload a video' },
        { value: 'youtube', label: 'YouTube', placeholder: 'Paste Youtube link' },
        // { value: 'instagram', label: 'Instagram', placeholder: 'Paste Instagram post URL' },
        // { value: 'twitter', label: 'Twitter', placeholder: 'Paste tweet URL' },
        // { value: 'tiktok', label: 'TikTok', placeholder: 'Paste TikTok URL' }
    ];

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            e.preventDefault();
            const files = e.target.files;
            if (!files?.length) {
                toast('Please select the file you want to upload', { type: 'error' });
                return;
            }

            const response = await fetch(`/api/backblaze/upload-media?id=${user.id}`, {
                method: 'POST',
                headers: {
                    'content-type': files[0].type
                },
                body: files[0]
            });
            if (response.ok) {
                const fileInfo = await response.json();
                setStoryUrl(fileInfo.fileUrl)
                toast.success('Uploaded successfully');
            }
        } catch (err: any) {
            console.log(err);
            toast(err.message || 'Something went wrong while uploading file. Please try again', { type: 'error' });
        }
    };

    const saveStory = async () => {
        setSaving(true);
        switch (selectedMediaOption?.value) {
            case 'youtube':
                mediaId = getYoutubeId(storyUrl);
                break;
            default:
                break;
        }

        const story = {
            name: title,
            description: description,
            type: selectedMediaOption?.value,
            url: storyUrl,
            media_id: mediaId,
            cta_link: ctaLink,
            cta_text: ctaText,
            user_id: user.id,
        };

        const { data, error } = await supabase.from('stories').insert(story);
        if (data) {
            await fetch(`/api/backblaze/upload?id=${user.id}`);
            toast.success('Story created successfully');
            router.push('/stories');
        } else {
            toast('Something went wrong. Please try again', { type: 'error' });
            // delete created record
            // await supabase.from('stories').delete().match({ id: story_id });
            console.error(error);
        }

        setSaving(false);
    };

    return (
        <div className="">
            <div className={styles.create}>
                <h3>Add your Story</h3>
                <form className={styles.inputs}
                    onSubmit={(e) => {
                        e.preventDefault();
                        title && selectedMediaOption?.value && (storyUrl || mediaId) && saveStory();
                    }}>
                    <Input
                        placeholder="Title"
                        icon="edit-3"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input
                        placeholder="Description"
                        icon="edit-3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Select
                        placeholder="Select Media Type"
                        onChange={option => setSelectedMediaOption(option as MediaOptions)}
                        options={mediaOptions}
                    />
                    {(selectedMediaOption?.value === 'image' || selectedMediaOption?.value === 'video') && (<>
                        <Input
                            type="url"
                            placeholder={selectedMediaOption?.placeholder || 'Media Link'}
                            icon="link"
                            value={storyUrl}
                            onChange={(e) => setStoryUrl(e.target.value)}
                        />
                    </>)}

                    {(selectedMediaOption?.value === 'upload-image' || selectedMediaOption?.value === 'upload-video') && (<>
                        {/* <Input
                            placeholder="Call to Action Link"
                            icon="link"
                            value={ctaLink}
                            onChange={(e) => setCtaLink(e.target.value)}
                        /> */}
                        <input type="file" ref={inputFileRef} onChange={handleFileSelect} />
                    </>)}
                    {selectedMediaOption?.value !== 'amp-story' && (<>
                        <Input
                            placeholder="Call to Action Link"
                            icon="link"
                            value={ctaLink}
                            onChange={(e) => setCtaLink(e.target.value)}
                        />
                        <Input
                            placeholder="Call to Action Link Text"
                            icon="edit-3"
                            value={ctaText}
                            onChange={(e) => setCtaText(e.target.value)}
                        />
                    </>)}
                    <div className={styles.submitBtn}>
                        <Button
                            size="large"
                            disabled={saving}
                            type='submit'>
                            <Icon type="plus-circle" />
                            <span>{saving ? 'Saving...' : 'Save'}</span>
                        </Button>
                    </div>
                </form>
            </div>
            {/* <div className="bg-red-800">
                <h1 className="text-3xl underline">
                    Hello world!
                </h1>
                <h3>Preview</h3>
            </div> */}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) {
        return { props: {}, redirect: { destination: '/login' } };
    }

    return { props: { user } };
}