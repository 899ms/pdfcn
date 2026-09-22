export interface PressReleaseDateline {
  city: string;
  state: string;
}

export interface PressReleaseQuote {
  text: string;
  author: string;
  title: string;
}

export interface PressReleaseMediaContact {
  name: string;
  email: string;
  phone: string;
  website?: string;
}

export interface PressReleaseSocialLink {
  platform: string;
  url: string;
}

export interface PressReleaseProps {
  companyName: string;
  companyLogo?: string;
  date: string;
  headline: string;
  subheadline?: string;
  dateline: PressReleaseDateline;
  body: string[];
  quotes?: PressReleaseQuote[];
  boilerplate: string;
  mediaContact: PressReleaseMediaContact;
  address?: string;
  socialLinks?: PressReleaseSocialLink[];
  accentColor?: string;
  renderingBase?: "takumi" | "forme";
}
