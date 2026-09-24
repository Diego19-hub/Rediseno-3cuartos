// TODO: reemplazar por contenido real antes de publicar.
// Todo el contenido de este archivo es ficticio y solo sirve para evaluar el layout.
export const resourcesDemo = {
  hero: {
    eyebrow: "RECURSOS / 3CUARTOS",
    title: "Ideas para tomar mejores decisiones digitales.",
    copy: "Estrategia, marca, marketing y desarrollo web explicados desde la experiencia.",
    line: "ESTRATEGIA / BRANDING / MARKETING / DESARROLLO WEB",
  },
  featured: {
    category: "ESTRATEGIA",
    readingTime: "6 min de lectura",
    title: "Cuando todo parece urgente, empezar por la dirección.",
    excerpt: "Una nota demo sobre cómo ordenar preguntas antes de convertirlas en decisiones digitales.",
    href: "#recurso-destacado",
  },
  topics: [
    { label: "Estrategia", href: "/servicios" },
    { label: "Branding", href: "/servicios/diseno-branding" },
    { label: "Marketing", href: "/servicios/marketing-digital" },
    { label: "Desarrollo web", href: "/servicios/desarrollo-web" },
    { label: "Tecnología", href: "/servicios" },
  ],
  articles: [
    { category: "BRANDING", title: "Una marca también se construye en los detalles.", excerpt: "Apunte demo sobre identidad, contexto y consistencia.", meta: "4 min de lectura", visual: "visualBranding" },
    { category: "MARKETING", title: "Comunicar mejor empieza por escuchar mejor.", excerpt: "Una perspectiva demo sobre señales, audiencias y claridad.", meta: "5 min de lectura", visual: "visualMarketing" },
    { category: "DESARROLLO WEB", title: "La tecnología necesita una pregunta correcta.", excerpt: "Nota demo sobre productos digitales que acompañan una dirección.", meta: "7 min de lectura", visual: "visualWeb" },
    { category: "TECNOLOGÍA", title: "Conectar sistemas para hacer espacio a lo importante.", excerpt: "Ensayo demo sobre decisiones técnicas y trabajo cotidiano.", meta: "3 min de lectura", visual: "visualTechnology" },
  ],
  needs: [
    { label: "Quiero hacer crecer mi negocio", href: "/servicios/marketing-digital" },
    { label: "Quiero construir o mejorar mi marca", href: "/servicios/diseno-branding" },
    { label: "Necesito una mejor presencia digital", href: "/servicios/desarrollo-web" },
  ],
  cta: {
    title: "Una idea es más útil cuando se convierte en acción.",
    copy: "Si encontraste algo relacionado con lo que estás intentando resolver, hablemos.",
    label: "Cuéntanos tu proyecto →",
    href: "/contacto",
  },
} as const;
