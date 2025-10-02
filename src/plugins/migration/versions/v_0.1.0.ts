import { v_0_0_0 } from "/src/plugins/migration/versions/v_0.0.0.ts";
import { load, remove, save } from "/src/util/storage.ts";

export type v_0_1_0 = {
  // 更改
  languages: {
    src: string[]
    dst: string[]
  }

  // 改名
  general: v_0_0_0["global"]

  // 不变
  records: v_0_0_0["records"]
  service: v_0_0_0["service"]
  services: v_0_0_0["services"]
  keybinding: v_0_0_0["keybinding"]
}

export default () => {
  const src = load("src_languages", [])
  const dst = load("dst_languages", [])
  const global = load("global", {})
  src?.length && dst?.length && save("languages", { src, dst })
  Object.keys(global).length && save("general", global)

  remove("src_languages")
  remove("dst_languages")
  remove("global")
}
