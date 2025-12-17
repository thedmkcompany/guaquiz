/**
 * StructuredData Component
 *
 * Injects JSON-LD structured data into the page head for SEO.
 * Supports single or multiple schemas.
 */

import Script from "next/script";

interface StructuredDataProps {
  data: object | object[];
}

export function StructuredData({ data }: StructuredDataProps) {
  const schemaArray = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemaArray.map((schema, index) => (
        <Script
          key={index}
          id={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
          strategy="afterInteractive"
        />
      ))}
    </>
  );
}

/**
 * Multi-schema wrapper for pages with multiple structured data blocks
 */
export function MultipleStructuredData({ schemas }: { schemas: object[] }) {
  return <StructuredData data={schemas} />;
}
