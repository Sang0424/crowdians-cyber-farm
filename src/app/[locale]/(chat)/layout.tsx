import { ReactNode } from "react";

export default function ChatLayout({children, modal}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
