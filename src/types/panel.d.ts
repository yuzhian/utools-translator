import { ReactNode } from "react";

declare global {
  interface ComponentProps {
    key: string
    name: string
    element: ReactNode
  }
}
