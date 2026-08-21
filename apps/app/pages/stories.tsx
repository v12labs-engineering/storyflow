/* eslint-disable @next/next/no-img-element */
import { supabase } from '@supabase/client';
import { GetServerSideProps } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import styles from '@styles/Stories.module.css';
import Icon from '@components/Icon';
import DashboardShell from '@components/DashboardShell';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { isLocalDemoRequest, localDemoStories, localDemoUser } from '@lib/local-demo';

type StoryStatus = 'Published' | 'Draft' | 'Scheduled';

interface Story {
  id: string;
  name: string;
  description: string;
  url: string;
  user_id: string;
  thumbnail?: string;
  status?: StoryStatus;
  publishedAt?: string;
  lastEdited?: string;
  views?: number;
  completionRate?: number;
  ctaClicks?: number;
}

interface StoryProps {
  user: User;
  demo?: boolean;
  initialStories?: Story[];
}

const fallbackThumbnails = [
  '/story-thumbnails/product-launch.jpg',
  '/story-thumbnails/customer-spotlight.jpg',
  '/story-thumbnails/weekly-update.jpg',
  '/story-thumbnails/design-systems.jpg',
  '/story-thumbnails/summer-campaign.jpg',
];

const formatNumber = (value = 0) => new Intl.NumberFormat('en-US').format(value);

function normalizeStory(story: Story, index: number): Story {
  return {
    ...story,
    thumbnail: story.thumbnail || fallbackThumbnails[index % fallbackThumbnails.length],
    status: story.status || 'Published',
    publishedAt: story.publishedAt || 'Recently',
    lastEdited: story.lastEdited || 'Recently',
    views: story.views || 0,
    completionRate: story.completionRate || 0,
    ctaClicks: story.ctaClicks || 0,
  };
}

export default function Stories({ user, demo = false, initialStories = [] }: StoryProps) {
  const [fetching, setFetching] = useState(!demo);
  const [stories, setStories] = useState<Story[]>(initialStories.map(normalizeStory));
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All status' | StoryStatus>('All status');
  const [sortBy, setSortBy] = useState<'Last edited' | 'Most viewed' | 'Name'>('Last edited');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const fetchStories = async () => {
    setFetching(true);
    const { data, error } = await supabase.from('stories').select('*').match({ user_id: user.id });
    if (data) setStories((data as Story[]).map(normalizeStory));
    if (error) console.error(error);
    setFetching(false);
  };

  useEffect(() => {
    if (demo) {
      const saved = window.localStorage.getItem('storyflow-demo-stories');
      if (saved) {
        try {
          const localStories = JSON.parse(saved) as Story[];
          setStories([...localStories.map(normalizeStory), ...initialStories.map(normalizeStory)]);
        } catch {
          window.localStorage.removeItem('storyflow-demo-stories');
        }
      }
      if (router.query.created === '1') toast.success('Draft created in your local demo workspace.');
      return;
    }
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  const visibleStories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = stories.filter((story) => {
      const matchesQuery = !normalizedQuery || `${story.name} ${story.description}`.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === 'All status' || story.status === status;
      return matchesQuery && matchesStatus;
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === 'Most viewed') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      return stories.indexOf(a) - stories.indexOf(b);
    });
  }, [query, sortBy, status, stories]);

  const removeStory = async (storyId: string) => {
    setOpenMenu(null);
    if (demo) {
      const nextStories = stories.filter((story) => story.id !== storyId);
      setStories(nextStories);
      window.localStorage.setItem('storyflow-demo-stories', JSON.stringify(nextStories.filter((story) => story.id.startsWith('local-'))));
      toast.success('Story removed from the local demo.');
      return;
    }
    const { data, error } = await supabase.from('stories').delete().match({ id: storyId });
    if (data) {
      await fetch(`/api/backblaze/upload?id=${user.id}`, { method: 'POST' });
      await fetchStories();
      toast.success('Story removed.');
    }
    if (error) toast.error('Unable to remove this story. Please try again.');
  };

  const copyIntegration = async () => {
    const snippet = `<script type="text/javascript" async id="storyflow-script" src="${process.env.NEXT_PUBLIC_STORYFLOW_WIDGET}" data-storyflow-user="${user.id}"></script>`;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <DashboardShell email={user.email}>
      <section className={styles.page} aria-labelledby="stories-title">
        <header className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Welcome back, Sarah</p>
            <h1 id="stories-title">Stories</h1>
            <p className={styles.subtitle}>Create, manage, and measure your stories.</p>
          </div>
          <div className={styles.headerActions}>
            <label className={styles.search}>
              <span className={styles.srOnly}>Search stories</span><Icon type="search" size={19} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories…" />
            </label>
            <label className={styles.selectWrap}>
              <span className={styles.srOnly}>Filter by status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                <option>All status</option><option>Published</option><option>Draft</option><option>Scheduled</option>
              </select><Icon type="chevron-down" size={16} />
            </label>
            <button className={styles.primaryButton} type="button" onClick={() => router.push('/create')}>
              <Icon type="plus" size={19} /> New story
            </button>
          </div>
        </header>

        <div className={styles.dashboardGrid}>
          <section className={styles.library} aria-label="Story library">
            <div className={styles.libraryToolbar}>
              <span>{visibleStories.length} {visibleStories.length === 1 ? 'story' : 'stories'}</span>
              <div className={styles.toolbarControls}>
                <label className={styles.sortLabel}>Sort by:
                  <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
                    <option>Last edited</option><option>Most viewed</option><option>Name</option>
                  </select>
                </label>
                <div className={styles.viewToggle} role="group" aria-label="Story view">
                  <button type="button" className={view === 'grid' ? styles.selected : ''} onClick={() => setView('grid')} aria-label="Grid view"><Icon type="grid" size={17} /></button>
                  <button type="button" className={view === 'list' ? styles.selected : ''} onClick={() => setView('list')} aria-label="List view"><Icon type="list" size={18} /></button>
                </div>
              </div>
            </div>

            {fetching && <div className={styles.loadingState}>Loading your stories…</div>}
            {!fetching && visibleStories.length === 0 && (
              <div className={styles.emptyState}>
                <Icon type="search" size={28} /><h2>No stories found</h2><p>Try another search or status filter.</p>
                <button type="button" onClick={() => { setQuery(''); setStatus('All status'); }}>Clear filters</button>
              </div>
            )}

            <div className={`${styles.storyList} ${view === 'grid' ? styles.gridView : ''}`}>
              {visibleStories.map((story) => (
                <article className={styles.storyCard} key={story.id}>
                  <img className={styles.thumbnail} src={story.thumbnail} alt="" width="288" height="192" loading="lazy" />
                  <div className={styles.storyBody}>
                    <div className={styles.storyTopline}>
                      <div><h2>{story.name}</h2><div className={styles.storyState}>
                        <span className={`${styles.status} ${styles[`status${story.status}`]}`}>{story.status}</span><span aria-hidden="true">•</span><span>{story.publishedAt}</span>
                      </div></div>
                      <div className={styles.menuWrap}>
                        <button type="button" className={styles.iconButton} aria-label={`Actions for ${story.name}`} aria-expanded={openMenu === story.id} onClick={() => setOpenMenu(openMenu === story.id ? null : story.id)}><Icon type="more-horizontal" size={20} /></button>
                        {openMenu === story.id && <div className={styles.actionMenu} role="menu">
                          <button type="button" role="menuitem" onClick={() => router.push(demo ? `/create?source=${story.id}` : `/editor/${story.id}`)}><Icon type="edit-3" size={15} /> Edit</button>
                          <button type="button" role="menuitem" onClick={() => toast.info('Preview opened for this local story.')}><Icon type="eye" size={15} /> Preview</button>
                          <button type="button" role="menuitem" className={styles.dangerAction} onClick={() => removeStory(story.id)}><Icon type="trash-2" size={15} /> Delete</button>
                        </div>}
                      </div>
                    </div>
                    <p className={styles.description}>{story.description}</p>
                    <dl className={styles.metrics}>
                      <div><dt><Icon type="eye" size={16} /> Views</dt><dd>{formatNumber(story.views)}</dd></div>
                      <div><dt><Icon type="clock" size={16} /> Completion</dt><dd>{story.completionRate}%</dd></div>
                      <div><dt><Icon type="mouse-pointer" size={16} /> CTA clicks</dt><dd>{formatNumber(story.ctaClicks)}</dd></div>
                      <div><dt><Icon type="calendar" size={16} /> Last edited</dt><dd>{story.lastEdited}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className={styles.insights} aria-label="Story performance and integration health">
            <section className={styles.insightCard} id="performance">
              <h2><Icon type="trending-up" size={20} /> Performance insights</h2>
              <select className={styles.compactSelect} aria-label="Performance date range" defaultValue="Last 7 days"><option>Last 7 days</option><option>Last 30 days</option></select>
              <dl className={styles.performanceList}>
                <div><span className={styles.metricIcon}><Icon type="eye" size={18} /></span><dt>Total views</dt><dd>41,417</dd><small className={styles.positive}>+18.6%</small></div>
                <div><span className={styles.metricIcon}><Icon type="percent" size={18} /></span><dt>Avg. completion</dt><dd>73%</dd><small className={styles.positive}>+6.2%</small></div>
                <div><span className={styles.metricIcon}><Icon type="mouse-pointer" size={18} /></span><dt>Total CTA clicks</dt><dd>2,877</dd><small className={styles.positive}>+24.1%</small></div>
                <div><span className={`${styles.metricIcon} ${styles.metricIconMint}`}><Icon type="clock" size={18} /></span><dt>Avg. time to complete</dt><dd>1m 24s</dd><small className={styles.negative}>−5.3%</small></div>
              </dl>
              <a href="#stories-title" className={styles.cardLink}>View analytics <Icon type="arrow-right" size={16} /></a>
            </section>
            <section className={styles.insightCard} id="integrations">
              <h2><Icon type="settings" size={20} /> Integration health</h2>
              <ul className={styles.integrationList}>
                <li><Icon type="check-circle" size={17} /><span>Storyflow Widget</span><strong>Healthy</strong></li>
                <li><Icon type="check-circle" size={17} /><span>Local Website</span><strong>Healthy</strong></li>
                <li><Icon type="check-circle" size={17} /><span>Google Analytics 4</span><strong>Healthy</strong></li>
                <li className={styles.warning}><Icon type="alert-circle" size={17} /><span>HubSpot</span><strong>Degraded</strong></li>
                <li className={styles.disconnected}><Icon type="x-circle" size={17} /><span>Mailchimp</span><strong>Disconnected</strong></li>
              </ul>
              <button type="button" className={styles.cardLink} onClick={copyIntegration}><Icon type={copied ? 'check' : 'copy'} size={16} />{copied ? 'Snippet copied' : 'Copy widget snippet'}</button>
            </section>
          </aside>
        </div>
      </section>
    </DashboardShell>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (isLocalDemoRequest(req)) return { props: { user: localDemoUser, demo: true, initialStories: localDemoStories } };
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) return { props: {}, redirect: { destination: '/login' } };
  return { props: { user } };
};
