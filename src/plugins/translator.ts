const modules: Record<string, { default: Translator }> = import.meta.glob('/src/plugins/translator/*.(ts|js)', { eager: true })

const translatorModules = Object.entries(modules).map(([key, { default: translator }]) => [
  key.replace(/^\/src\/plugins\/translator\//, '').replace(/\.(ts|js)$/, ''),
  translator,
])

export const translators = Object.freeze(Object.fromEntries(translatorModules))
