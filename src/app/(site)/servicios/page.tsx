import { servicesProvisional } from "@/content/services.provisional";
import { getServicesPageContent } from "@/lib/wordpress/services";
import { ServicesPageResponsive } from "./services-page-responsive";

export const metadata = { title: "Servicios | 3cuartos", description: "Servicios conectados de branding, desarrollo web y marketing digital." };

export default async function ServicesPage() {
  const content = await getServicesPageContent();
  return <ServicesPageResponsive intro={servicesProvisional.hero} services={content.services} servicesSource={content.source} />;
}
