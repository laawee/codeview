import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script src="https://unpkg.com/react@17.0.2/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/@babel/standalone@7.14.7/babel.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
