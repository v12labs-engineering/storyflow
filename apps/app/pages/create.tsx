/* eslint-disable @next/next/no-img-element */
import DashboardShell from '@components/DashboardShell';
import Icon from '@components/Icon';
import { supabase } from '@supabase/client';
import { GetServerSideProps } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import styles from '@styles/Create.module.css';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getYoutubeId } from '@utils/index';
import { isLocalDemoRequest, localDemoStories, localDemoUser } from '@lib/local-demo';

interface CreateProps { user: User; demo?: boolean; }
type MediaType = 'image' | 'upload-image' | 'video' | 'upload-video' | 'youtube' | 'amp-story';

export default function Create({ user, demo = false }: CreateProps) {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [storyUrl, setStoryUrl] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [ctaLink, setCtaLink] = useState('');
  const [ctaText, setCtaText] = useState('Learn more');

  useEffect(() => {
    if (!demo || typeof router.query.source !== 'string') return;
    const source = localDemoStories.find((story) => story.id === router.query.source);
    if (source) {
      setTitle(`${source.name} copy`);
      setDescription(source.description);
      setStoryUrl(source.thumbnail);
    }
  }, [demo, router.query.source]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    if (demo) {
      setStoryUrl('/story-thumbnails/design-systems.jpg');
      toast.success('Demo media attached locally.');
      return;
    }
    try {
      const response = await fetch(`/api/backblaze/upload-media?id=${user.id}`, {
        method: 'POST', headers: { 'content-type': files[0].type }, body: files[0],
      });
      if (response.ok) {
        const fileInfo = await response.json();
        setStoryUrl(fileInfo.fileUrl);
        toast.success('Media uploaded.');
      } else toast.error('Unable to upload this media.');
    } catch (error: any) {
      toast.error(error.message || 'Unable to upload this media.');
    }
  };

  const saveStory = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Add a title and description before saving.');
      return;
    }
    setSaving(true);

    if (demo) {
      const existing = window.localStorage.getItem('storyflow-demo-stories');
      const localStories = existing ? JSON.parse(existing) : [];
      localStories.unshift({
        id: `local-${Date.now()}`,
        name: title.trim(),
        description: description.trim(),
        url: storyUrl || '/story-thumbnails/design-systems.jpg',
        thumbnail: storyUrl || '/story-thumbnails/design-systems.jpg',
        status: 'Draft',
        publishedAt: 'Just now',
        lastEdited: 'Just now',
        views: 0,
        completionRate: 0,
        ctaClicks: 0,
        user_id: user.id,
      });
      window.localStorage.setItem('storyflow-demo-stories', JSON.stringify(localStories));
      await router.push('/stories?created=1');
      return;
    }

    const story = {
      name: title.trim(), description: description.trim(), type: mediaType,
      url: storyUrl, media_id: mediaType === 'youtube' ? getYoutubeId(storyUrl) : '',
      cta_link: ctaLink, cta_text: ctaText, user_id: user.id,
    };
    const { data, error } = await supabase.from('stories').insert(story);
    if (data) {
      await fetch(`/api/backblaze/upload?id=${user.id}`, { method: 'POST' });
      toast.success('Story created.');
      await router.push('/stories');
    } else {
      console.error(error);
      toast.error('Unable to create this story.');
      setSaving(false);
    }
  };

  const previewImage = storyUrl && storyUrl.startsWith('/') ? storyUrl : '/story-thumbnails/design-systems.jpg';

  return (
    <DashboardShell email={user.email}>
      <section className={styles.page} aria-labelledby="create-title">
        <button className={styles.backButton} type="button" onClick={() => router.push('/stories')}><Icon type="arrow-left" size={17} /> Back to stories</button>
        <header className={styles.header}>
          <div><p className={styles.eyebrow}>Story builder</p><h1 id="create-title">Create a new story</h1><p>Start with the essentials. You can refine pages and interactions in the editor.</p></div>
          <span className={styles.saveState}><Icon type="check-circle" size={17} /> Local draft</span>
        </header>

        <div className={styles.builderGrid}>
          <form className={styles.formCard} onSubmit={(event) => { event.preventDefault(); saveStory(); }}>
            <div className={styles.sectionHeading}><span>1</span><div><h2>Story details</h2><p>Name this story and give collaborators context.</p></div></div>
            <label className={styles.field}><span>Story title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="For example: Product launch" required /></label>
            <label className={styles.field}><span>Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What will viewers learn from this story?" rows={4} required /></label>

            <div className={styles.divider} />
            <div className={styles.sectionHeading}><span>2</span><div><h2>Starting media</h2><p>Choose a source for the first page.</p></div></div>
            <label className={styles.field}><span>Media type</span><select value={mediaType} onChange={(event) => setMediaType(event.target.value as MediaType)}>
              <option value="image">Image URL</option><option value="upload-image">Upload image</option><option value="video">Video URL</option><option value="upload-video">Upload video</option><option value="youtube">YouTube</option><option value="amp-story">Existing AMP story</option>
            </select></label>
            {(mediaType === 'upload-image' || mediaType === 'upload-video') ? (
              <div className={styles.uploadField}>
                <input type="file" ref={inputFileRef} onChange={handleFileSelect} accept={mediaType === 'upload-image' ? 'image/*' : 'video/*'} />
                <Icon type="upload-cloud" size={24} /><strong>Choose media</strong><small>Images or video up to 15 MB</small>
              </div>
            ) : (
              <label className={styles.field}><span>Media URL</span><input type="url" value={storyUrl} onChange={(event) => setStoryUrl(event.target.value)} placeholder="https://example.com/media" /></label>
            )}

            {mediaType !== 'amp-story' && <>
              <div className={styles.twoFields}>
                <label className={styles.field}><span>Call-to-action label</span><input value={ctaText} onChange={(event) => setCtaText(event.target.value)} placeholder="Learn more" /></label>
                <label className={styles.field}><span>Call-to-action URL</span><input type="url" value={ctaLink} onChange={(event) => setCtaLink(event.target.value)} placeholder="https://example.com" /></label>
              </div>
            </>}

            <div className={styles.formActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => router.push('/stories')}>Cancel</button>
              <button type="submit" className={styles.primaryButton} disabled={saving}><Icon type="arrow-right" size={18} /> {saving ? 'Creating…' : 'Create draft'}</button>
            </div>
          </form>

          <aside className={styles.previewCard} aria-label="Story preview">
            <div className={styles.previewHeading}><div><span>Live preview</span><strong>Mobile story cover</strong></div><Icon type="smartphone" size={21} /></div>
            <div className={styles.previewFrame}>
              <img src={previewImage} alt="" />
              <div className={styles.previewCopy}><small>ACME CLOUD</small><h2>{title || 'Your story title'}</h2><p>{description || 'Your story description will appear here.'}</p><span>{ctaText || 'Learn more'}</span></div>
            </div>
            <div className={styles.checklist}>
              <h2>Ready to build</h2>
              <p><Icon type="check-circle" size={17} /> Responsive 9:16 cover</p>
              <p><Icon type="check-circle" size={17} /> Draft-first publishing</p>
              <p><Icon type="check-circle" size={17} /> Widget-ready output</p>
            </div>
          </aside>
        </div>
      </section>
    </DashboardShell>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (isLocalDemoRequest(req)) return { props: { user: localDemoUser, demo: true } };
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) return { props: {}, redirect: { destination: '/login' } };
  return { props: { user } };
};
