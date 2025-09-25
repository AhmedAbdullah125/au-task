import ReactQueryProvider from '@/src/utils/providers/ReactQueryProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './globals.css';
import '@/src/style/main.css';
import NavBar from '@/components/navBar/NavBar';
import Footer from '@/components/footer/Footer';
import { CounterProvider } from '@/src/Context/CounterContext';
import { Toaster } from 'sonner';
import { ProfileDataProvider } from '@/src/Context/ProfileContext';
import logo from '@/public/images/blue-logo.svg';


export async function generateMetadata() {
  // const seoData = await getSeoData(); // Fetch data on the server
  return {
    title: 'B3',
    description: 'B3',
    keywords: "B3",
    openGraph: {
      title: 'B3',
      description: 'B3', 
      url: 'B3-rose.vercel.com',
      siteName: "B3",
      images: [
        {
          // url: seoData?.seo_image || logo.src ,
          url: 'https://b3-rose.vercel.app/_next/static/media/blue-logo.62b83cbf.svg',
          width: 1200,
          height: 630,
          alt: 'B3',
        },
      ],
      type: 'website',
      locale: 'ar_SA',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} ${alexandria.variable}`}
        suppressHydrationWarning={true}
      >
        <ReactQueryProvider>
          <ProfileDataProvider>
            <CounterProvider>
              <NavBar />
              {children}
              <Footer />
            </CounterProvider>
          </ProfileDataProvider>
        </ReactQueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
