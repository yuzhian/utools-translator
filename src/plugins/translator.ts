const modules = import.meta.globEager('/src/plugins/translator/*.(ts|js)')

export const translators = Object.fromEntries(
  Object.entries(modules).map(([key, { default: translator }]) => [key.replace(/^\/src\/plugins\/translator\//, '').replace(/\.(ts|js)$/, ''), translator])
)
