export const getQueryParams = url => {
  const [_baseURL, paramsQuery] = url.split('?')

  if (!paramsQuery) return {}

  const params = paramsQuery.split('&')
  const obj = {}

  params.forEach(tuple => {
    const [key, value] = tuple.split('=')

    obj[key] = value
  })

  return obj
}

export const getURL = () =>
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:4000'
    : 'http://localhost:4000'
