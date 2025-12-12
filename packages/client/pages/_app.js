import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  console.log('My App Version:', process.env.APP_VERSION);
  return <Component {...pageProps} />
}

export default MyApp
