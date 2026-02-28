/**
 * StructuredData Component
 *
 * Injects JSON-LD structured data into the page using an inline <script> tag
 * so that it is present in the initial HTML and immediately visible to crawlers.
 * Do NOT use next/script here — strategy="afterInteractive" defers execution
 * past hydration, which is suboptimal for structured data.
 */

interface StructuredDataProps {
  data: object | object[];
}

export function StructuredData({ data }: StructuredDataProps) {
  const schemaArray = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemaArray.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
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
