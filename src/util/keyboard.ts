import { KeyboardEvent } from "react";

export const onEscape = (func?: (event: KeyboardEvent<HTMLDivElement>) => void) => (event: KeyboardEvent<HTMLDivElement>) => {
  if ("Escape" === event.key) {
    event.stopPropagation()
    func?.(event)
  }
}
