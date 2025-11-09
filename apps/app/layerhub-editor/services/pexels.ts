import axios from "axios"

// eslint-disable-next-line turbo/no-undeclared-env-vars
const PEXELS_KEY = process.env.NEXT_PUBLIC_PEXELS_KEY
const pexelsClient = axios.create({
  baseURL: "https://api.pexels.com",
  headers: {
    Authorization: PEXELS_KEY as string,
  },
})

export const getPexelsImages = (query: string) => {
  return new Promise((resolve, reject) => {
    pexelsClient
      .get(`/v1/search?query=${query}&per_page=20`)
      .then(({ data }) => {
        const images = data.photos.map((image: any) => ({
          id: image.id,
          type: "StaticImage",
          src: image.src,
        }))
        resolve(images)
      })
      .catch((err) => reject(err))
  })
}

export const getPexelsVideos = (query: string) => {
  return new Promise((resolve, reject) => {
    pexelsClient
      .get(`/videos/search?query=${query}&per_page=20&size=small`)
      .then(({ data }) => {
        const videos = data.videos.map((video: any) => ({
          id: video.id,
          type: "StaticVideo",
          src: video.video_files[0].link,
          preview: video.image,
          duration: 1,
        }))
        resolve(videos)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}
