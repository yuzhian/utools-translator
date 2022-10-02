const prod = import.meta.env.PROD

const storage = () => (prod ? window.utools?.dbStorage || localStorage : localStorage)

export const setItem = (key: string, value: string) => {
  storage().setItem(key, value)
}

export const getItem = (key: string): any => {
  return storage().getItem(key)
}

export const removeItem = (key: string) => {
  storage().removeItem(key)
}
