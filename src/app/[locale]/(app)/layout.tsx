import { ReactNode } from "react";
import { Flex } from "@radix-ui/themes";
import SideNav from "@/../components/layout/side-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Flex>
      <SideNav />
      <main
        style={{
          flexGrow: 1,
          fontFamily: "DungGeunMo",
        }}
      >
        {children}
      </main>
    </Flex>
  );
}
