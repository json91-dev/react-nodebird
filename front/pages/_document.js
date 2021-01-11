import React from 'react';
import Helmet from 'react-helmet';
import Document, { Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static getInitialProps(context) {
    return { helmet: Helmet.renderStatic() };
  }

  render() {
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
    const htmlAttrs = htmlAttributes.toComment();
    const bodyAttrs = bodyAttributes.toComment();

    return (
      <html {...htmlAttrs}>
        <head>
          {Object.values(helmet).map(el => el.toComponent())}
        </head>
        <body {...bodyAttrs}>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
