const modules: Record<string, { default: Command }> = import.meta.glob('/src/plugins/command/*.(ts|js)', { eager: true })

const commandModules = Object.entries(modules).map(([key, { default: command }]) => [
  key.replace(/^\/src\/plugins\/command\//, '').replace(/\.(ts|js)$/, ''),
  command,
])

export const commands = Object.freeze(Object.fromEntries(commandModules))
