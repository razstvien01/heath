import React from 'react'
import Head from 'next/head'
import '../app/globals.css' 
 
export default function MyApp({ Component, pageProps }: { Component: React.ComponentType, pageProps: any }): React.JSX.Element {
  return (
    <>
      <Head>
        <title>Page</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
 