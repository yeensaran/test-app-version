import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  console.log('App Version:', process.env.NEXT_PUBLIC_APP_VERSION);
  return <Component {...pageProps} />
}

export default MyApp
