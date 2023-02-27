import { find, get } from "lodash";
import { getToml } from "../stellar/sep24/getToml";

export async function getAssetFromApay(code) {
  const response = await getToml("https://apay.io/.well-known/stellar.toml");
  return find(get(response, "CURRENCIES"), { code });
}
