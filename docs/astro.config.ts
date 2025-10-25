import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightPageActions from 'starlight-page-actions'

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/dlcastillop/starlight-page-actions/edit/main/docs/',
      },
      plugins: [starlightPageActions()],
      sidebar: [
        {
          label: 'Start Here',
          items: ['getting-started'],
        },
      ],
      social: [
        { href: 'https://github.com/dlcastillop/starlight-page-actions', icon: 'github', label: 'GitHub' },
      ],
      title: 'starlight-page-actions',
    }),
  ],
})
