export type MediaAsset = {
  id: number;
  alt: string;
  url: string;
  width?: number;
  height?: number;
};

export type SeoMetadata = {
  title: string;
  description: string;
  noindex: boolean;
};

export type CallToAction = { label: string; url: string };
export type Metric = { label: string; value: string; context: string };
export type ProfileLink = { label: string; url: string };

export type Service = {
  id: number;
  slug: string;
  name: string;
  summary: string;
  visualIdentifier: string;
  description: string;
  capabilities: string[];
  image?: MediaAsset;
  cta: CallToAction;
  order: number;
  seo: SeoMetadata;
  isProvisional: boolean;
};

export type CaseStudy = {
  id: number;
  slug: string;
  title: string;
  content: string;
  clientName: string;
  challenge: string;
  objectives: string[];
  solution: string;
  serviceIds: number[];
  results: string[];
  metrics: Metric[];
  gallery: MediaAsset[];
  testimonialId?: number;
  cta: CallToAction;
  seo: SeoMetadata;
  isProvisional: boolean;
};

export type Testimonial = {
  id: number;
  quote: string;
  personName: string;
  jobTitle: string;
  company: string;
  image?: MediaAsset;
  caseStudyId?: number;
  order: number;
  isProvisional: boolean;
};

export type TeamMember = {
  id: number;
  slug: string;
  name: string;
  biography: string;
  role: string;
  image?: MediaAsset;
  links: ProfileLink[];
  order: number;
  isProvisional: boolean;
};

export type Resource = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featuredExcerpt: string;
  content: string;
  image?: MediaAsset;
  cta: CallToAction;
  readingTime: number;
  publishedAt: string;
};

export type GlobalSettings = {
  brandName: string;
  contact: { publicEmail: string; phone: string };
  whatsappUrl: string;
  bookingUrl: string;
  socialLinks: ProfileLink[];
  legalLinks: ProfileLink[];
  globalCta: CallToAction;
  defaultSeo: SeoMetadata;
};
