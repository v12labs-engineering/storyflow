import type { NextPage } from 'next';
import Story from '@components/Story';
import LandingPageInput from '@components/LandingPageInput';
import styles from '@styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <Story className={styles.storyLayout}>
      <Story.Page>
        <div className={styles.main}>
          <div className={styles.title}>
            <h1>
              Add Interactive <span>stories widget </span>
              to your website in <span>minutes</span>.
            </h1>
            <p>
              <span>Increase traffic, sales, feedbacks & leads capture</span>.
              Integrate on your website with just few bytes of JavaScript and reach a unique audience
              within a new storytelling experience on web.
            </p>
            <LandingPageInput />
          </div>
        </div>
      </Story.Page>
      <Story.Page>
        <div className={styles.main}>
          <div className={styles.title}>
            <h1>
              <span>Integrate once</span> and manage multiple stories in one place<span>.</span>
            </h1>
            <p>
              Post new stories using Storyflow dashboard which will get automatically updated on your website.
              Storyflow widget is directly integrated with dashboard to read latest content.
            </p>
            <LandingPageInput />
          </div>
        </div>
      </Story.Page>
      <Story.Page>
        <div className={styles.main}>
          <div className={styles.title}>
            <h1>
              Quickly add <span>Existing AMP stories</span> , <span>Videos</span>, <span>Images</span>,
              even your <span>Youtube videos</span> to create story experiences<span>.</span>
            </h1>
            <p>
              There are endless possibilities to add your own content to a story.
              No matter the platform, storyflow is ready to help you to integrate your content in single place.
              <span>Instagram</span>, <span>Twitter</span>, <span>TikTok</span> are coming soon.
            </p>
            <LandingPageInput />
          </div>
        </div>
      </Story.Page>
      <Story.Page>
        <div className={styles.main}>
          <div className={styles.title}>
            <h1>
              Use cutting edge <u><a target="_blank" rel="noreferrer" href="https://amp.dev/documentation/tools/?format=stories">tools</a></u> to create, design and develop engaging stories<span>.</span>
            </h1>
            <p><span>Storyflow WYSIWYG editor coming soon...</span></p>
            <p>
              Choose right tools for your story and get started.
              Alternatively, write your own stories using <u><a target="_blank" rel="noreferrer" href="https://amp.dev/documentation/guides-and-tutorials/start/visual_story/?format=stories">AMP framework</a></u>.
            </p>
            <LandingPageInput />
          </div>
        </div>
      </Story.Page>
      <Story.Page>
        <div className={styles.main}>
          <div className={styles.title}>
            <h1>
              Need a help to create your first story<span>?</span>
              <u>
                <p>
                  <a href="https://calendly.com/src200" target="_blank" rel="noreferrer">Schedule a demo</a>
                </p>
              </u>
            </h1>
            <p>
              For any other further assistance contact <u><a href="mailto:schalla200@gamil.com">me</a></u>
            </p>
            <LandingPageInput />
          </div>
        </div>
      </Story.Page>
    </Story>
  )
}

export default Home;
