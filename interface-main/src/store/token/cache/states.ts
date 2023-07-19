import { CacheTokenInfo, TokenMetadata } from "types/token";
import { TOKEN_STANDARD } from "constants/tokens";

export interface TokenCacheState {
  tokens: { [canisterId: string]: CacheTokenInfo };
  standards: { [canisterId: string]: TOKEN_STANDARD };
  importedTokens: { [canisterId: string]: TokenMetadata };
}

export const initialState: TokenCacheState = {
  tokens: {},
  standards: {},
  importedTokens: {},
};
