export type ServiceMotionKey = "marketing" | "branding" | "tecnologia" | "estrategia";

export type ServiceMotionConfig = {
  key: ServiceMotionKey;
  hero: string;
  relatedCase: string;
  cta: string;
  mobile: string;
  relatedCaseMobile: string;
  ctaMobile: string;
};

const serviceMotionMap: Partial<Record<ServiceMotionKey, ServiceMotionConfig>> = {
  marketing: {
    key: "marketing",
    hero: "/lottie/marketing-network.json?layout=hero-labels-v2",
    relatedCase: "/lottie/marketing-case-network.json?layout=case-emoji-labels-v1",
    cta: "/lottie/marketing-sphere.json",
    mobile: "/lottie/marketing-network-mobile.json",
    relatedCaseMobile: "/lottie/marketing-case-network-mobile.json?layout=case-emoji-labels-v1",
    ctaMobile: "/lottie/marketing-sphere-mobile.json",
  },
};

const serviceSlugMap: Partial<Record<string, ServiceMotionKey>> = {
  marketing: "marketing",
  "marketing-digital": "marketing",
};

export function getServiceMotion(slug: string): ServiceMotionConfig | null {
  const key = serviceSlugMap[slug];
  return key ? serviceMotionMap[key] ?? null : null;
}
