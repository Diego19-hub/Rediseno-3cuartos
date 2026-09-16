import type { ReactNode } from "react";
import styles from "./primitives.module.css";
export function FeedbackMessage({ children, type = "success" }: { children: ReactNode; type?: "success" | "error" }) { return <p className={styles[`feedback${type}`]} role={type === "error" ? "alert" : "status"}>{children}</p>; }
