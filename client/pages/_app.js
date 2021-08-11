import '../styles/globals.css'
import {AppWrapper} from "../Context/State"
function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
    <Component {...pageProps} />
    </AppWrapper>
  ) 
}

export default MyApp
