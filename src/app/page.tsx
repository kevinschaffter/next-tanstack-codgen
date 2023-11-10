import { Suspense } from "react";
import { css } from "@/styled-system/css";
import { grid } from "@/styled-system/patterns";
import {
  ClientComponent,
  ServerComponent,
  DynamicServerComponent,
  ServerHydration,
} from "./_components";
import { GridCell } from "@/components/GridCell";
import { Loading } from "@/components/Loading";

export default function Home() {
  return (
    <main
      className={css({
        display: "flex",
        minHeight: "screen",
        paddingX: "48",
        paddingY: "24",
        backgroundColor: "black",
        color: "white",
        fontSize: "md",
      })}
    >
      <section
        className={grid({
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr));",
          gridAutoRows: "300px",
          width: "full",
          gap: "10",
        })}
      >
        <GridCell>
          <Suspense fallback={<Loading />}>
            <ServerComponent />
          </Suspense>
        </GridCell>
        <GridCell>
          <Suspense fallback={<Loading />}>
            <DynamicServerComponent />
          </Suspense>
        </GridCell>
        <GridCell>
          <Suspense fallback={<Loading />}>
            <ServerHydration />
          </Suspense>
        </GridCell>
        <GridCell>
          <ClientComponent />
        </GridCell>
      </section>
    </main>
  );
}
