import { createClient, OAuthStrategy } from "@wix/sdk";
import { checkout } from "@wix/ecom";
import { redirects } from "@wix/redirects";

const WIX_STORES_APP_ID = "1380b703-ce81-ff05-f115-39571d94dfcd";

export { WIX_STORES_APP_ID };

export function createWixClient() {
  const clientId = process.env.WIX_CLIENT_ID;

  if (!clientId) {
    throw new Error("WIX_CLIENT_ID environment variable is not set");
  }

  return createClient({
    modules: {
      checkout,
      redirects,
    },
    auth: OAuthStrategy({ clientId }),
  });
}

export type WixClient = ReturnType<typeof createWixClient>;
