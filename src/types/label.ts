export interface LabelSocialLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface LabelProfile {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  social?: LabelSocialLinks;
  avatarUrl?: string | null;
}

export interface LabelProfileImageResponse {
  url: string;
}
