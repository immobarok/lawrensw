"use client";

import Head from "next/head";

type SeoTitleProps = {
  title: string;
  description?: string;
};

const SvalbardSeo = ({ title, description }: SeoTitleProps) => {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </Head>
  );
};

export default SvalbardSeo;
