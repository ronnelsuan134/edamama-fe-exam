import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

export default function ({ $pinia }) {
  $pinia.use(createPersistedStatePlugin({
    serialize: (value) => JSON.stringify(value)
  })
  )
}
