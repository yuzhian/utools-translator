const prod = import.meta.env.PROD

export const setItem = (key: string, value: string) => {
  prod ? utools.dbStorage.setItem(key, value) : localStorage.setItem(key, value)
}

export const getItem = (key: string): any => {
  return prod ? utools.dbStorage.getItem(key) : localStorage.getItem(key)
}

export const removeItem = (key: string) => {
  prod ? utools.dbStorage.removeItem(key) : localStorage.removeItem(key)
}
