export interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
}

export interface SpotifyUserProfile {
  id: string;
  email: string;
  display_name: string;
  external_urls: Record<string, string>;
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  images?: Array<{
    height: number | null;
    url: string;
    width: number | null;
  }>;
  uri: string;
  country?: string;
  explicit_content?: {
    filter_explicit_content: boolean;
    show_explicit_content: boolean;
  };
  product?: string;
}
