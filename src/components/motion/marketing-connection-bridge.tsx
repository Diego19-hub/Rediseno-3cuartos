import styles from "./marketing-connection-bridge.module.css";

export function MarketingConnectionBridge() {
  return (
    <div className={styles.bridge}>
      <svg className={styles.desktop} viewBox="0 0 1440 320" role="img" aria-label="Conexión visual entre Audiencia, Estrategia, Contenido y Resultados">
        <path className={styles.routeBack} d="M70 155 C220 40 325 258 500 145 S760 45 900 155 S1165 260 1370 112" />
        <path className={styles.routeMain} d="M70 166 C230 272 335 48 505 150 S760 224 915 144 S1165 70 1370 140" />
        <path className={styles.routeSoft} d="M70 145 C235 75 350 232 510 167 S755 75 905 166 S1170 225 1370 126" />
        <path className={styles.routeDash} d="M110 105 C260 25 355 212 535 126 S770 250 940 124 S1195 80 1340 180" />
        <g className={styles.secondaryNodes} aria-hidden="true">
          <circle cx="250" cy="193" r="4"/><circle cx="332" cy="94" r="5"/><circle cx="420" cy="206" r="6" className={styles.hollow}/>
          <circle cx="620" cy="91" r="5"/><circle cx="740" cy="202" r="4"/><circle cx="805" cy="92" r="6" className={styles.hollow}/>
          <circle cx="1030" cy="211" r="4"/><circle cx="1105" cy="90" r="5"/><circle cx="1205" cy="178" r="6" className={styles.hollow}/>
          <circle cx="1280" cy="85" r="4"/><circle cx="680" cy="60" r="4"/><circle cx="565" cy="231" r="4"/>
        </g>
        <g className={styles.mainNode} transform="translate(150 173)">
          <circle className={styles.halo} r="39"/><circle className={styles.iconDisc} r="25"/><g className={styles.icon}><circle cx="0" cy="0" r="11"/><path d="M0-18v5M18 0h-5M0 18v-5M-18 0h5"/><circle cx="0" cy="0" r="3"/></g>
          <rect className={styles.labelBg} x="-55" y="46" width="110" height="33" rx="16.5"/><text className={styles.label} x="0" y="68">Audiencia</text>
        </g>
        <g className={styles.mainNode} transform="translate(505 150)">
          <circle className={styles.halo} r="39"/><circle className={styles.iconDisc} r="25"/><g className={styles.icon}><circle r="12"/><path d="m-2 3 11-12M5-9h4v4"/><circle cx="-2" cy="3" r="2.5"/></g>
          <rect className={styles.labelBg} x="-60" y="46" width="120" height="33" rx="16.5"/><text className={styles.label} x="0" y="68">Estrategia</text>
        </g>
        <g className={styles.mainNode} transform="translate(915 144)">
          <circle className={styles.halo} r="39"/><circle className={styles.iconDisc} r="25"/><g className={styles.icon}><path d="m-12-5 12-7 12 7-12 7zM-12 1 0 8l12-7M-12 7 0 14l12-7"/></g>
          <rect className={styles.labelBg} x="-56" y="46" width="112" height="33" rx="16.5"/><text className={styles.label} x="0" y="68">Contenido</text>
        </g>
        <g className={styles.mainNode} transform="translate(1310 137)">
          <circle className={styles.halo} r="39"/><circle className={styles.iconDisc} r="25"/><g className={styles.icon}><circle r="12"/><circle r="6"/><path d="M0 0 13-13M7-13h6v6"/></g>
          <rect className={styles.labelBg} x="-58" y="46" width="116" height="33" rx="16.5"/><text className={styles.label} x="0" y="68">Resultados</text>
        </g>
        <circle className={styles.pulse} cx="70" cy="166" r="5"><animateMotion dur="14s" repeatCount="indefinite" path="M70 166 C230 272 335 48 505 150 S760 224 915 144 S1165 70 1370 140"/></circle>
        <circle className={styles.pulseAlt} cx="110" cy="105" r="3.5"><animateMotion dur="17s" begin="-6s" repeatCount="indefinite" path="M110 105 C260 25 355 212 535 126 S770 250 940 124 S1195 80 1340 180"/></circle>
      </svg>
      <svg className={styles.mobile} viewBox="0 0 390 390" role="img" aria-label="Conexión en zigzag entre Audiencia, Estrategia, Contenido y Resultados">
        <path className={styles.routeBack} d="M72 80 C116 103 133 176 176 195 C219 213 231 116 265 95 C305 72 306 217 330 275"/>
        <path className={styles.routeMain} d="M72 80 C108 122 133 176 176 195 C220 214 229 119 265 95 C301 71 310 225 330 275"/>
        <g className={styles.secondaryNodes} aria-hidden="true">
          <circle cx="115" cy="126" r="3"/><circle cx="139" cy="158" r="4" className={styles.hollow}/><circle cx="218" cy="153" r="3"/><circle cx="230" cy="129" r="4" className={styles.hollow}/><circle cx="291" cy="153" r="3"/><circle cx="310" cy="218" r="4" className={styles.hollow}/>
        </g>
        <g className={styles.mainNode} transform="translate(72 80)"><circle className={styles.halo} r="29"/><circle className={styles.iconDisc} r="20"/><g className={styles.icon}><circle r="9"/><path d="M0-14v4M14 0h-4M0 14v-4M-14 0h4"/></g><rect className={styles.labelBg} x="-55" y="37" width="110" height="31" rx="15.5"/><text className={styles.label} x="0" y="58">Audiencia</text></g>
        <g className={styles.mainNode} transform="translate(176 195)"><circle className={styles.halo} r="29"/><circle className={styles.iconDisc} r="19"/><g className={styles.icon}><circle r="10"/><path d="m-1 2 9-9M4-7h4v4"/></g><rect className={styles.labelBg} x="-63" y="37" width="126" height="31" rx="15.5"/><text className={styles.label} x="0" y="58">Estrategia</text></g>
        <g className={styles.mainNode} transform="translate(265 95)"><circle className={styles.halo} r="29"/><circle className={styles.iconDisc} r="20"/><g className={styles.icon}><path d="m-10-4 10-6 10 6-10 6zM-10 2 0 8l10-6"/></g><rect className={styles.labelBg} x="-59" y="37" width="118" height="31" rx="15.5"/><text className={styles.label} x="0" y="58">Contenido</text></g>
        <g className={styles.mainNode} transform="translate(330 275)"><circle className={styles.halo} r="30"/><circle className={styles.iconDisc} r="20"/><g className={styles.icon}><circle r="10"/><circle r="5"/><path d="M0 0 11-11M5-11h6v6"/></g><rect className={styles.labelBg} x="-64" y="37" width="128" height="31" rx="15.5"/><text className={styles.label} x="0" y="58">Resultados</text></g>
        <circle className={styles.pulse} cx="72" cy="80" r="4"><animateMotion dur="16s" repeatCount="indefinite" path="M72 80 C108 122 133 176 176 195 C220 214 229 119 265 95 C301 71 310 225 330 275"/></circle>
        <circle className={styles.pulseAlt} cx="72" cy="80" r="3"><animateMotion dur="20s" begin="-10s" repeatCount="indefinite" path="M72 80 C116 103 133 176 176 195 C219 213 231 116 265 95 C305 72 306 217 330 275"/></circle>
      </svg>
    </div>
  );
}
