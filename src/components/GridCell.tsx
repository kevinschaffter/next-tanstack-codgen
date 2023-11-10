import { center } from "@/styled-system/patterns";
import { ReactNode } from "react";

export function GridCell({ children }: { children: ReactNode }) {
  return (
    <div
      className={center({
        border: "2px solid gray",
        borderRadius: 10,
        height: "100%",
        width: "100%",
        textAlign: "center",
      })}
    >
      {children}
    </div>
  );
}
