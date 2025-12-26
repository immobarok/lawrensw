"use client";

import Head from "next/head";

type SeoTitleProps = {
  title: string;
  description?: string;
};

const AntarcticaSeo = ({ title, description }: SeoTitleProps) => {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <p className="text-sm font-normal text-start">{description}</p>
    </Head>
  );
};

export default AntarcticaSeo;
