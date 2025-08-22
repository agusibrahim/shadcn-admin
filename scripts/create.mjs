import fs from 'fs/promises'
import path from 'path'
import readline from 'readline/promises'
import { stdin, stdout } from 'process'

async function updateSidebar() {
  const sidebarPath = path.join('src','components','layout','data','sidebar-data.ts')
  const content = `import { LayoutDashboard, Settings } from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: '',
    email: '',
    avatar: ''
  },
  teams: [],
  navGroups: [
    {
      title: 'General',
      items: [
        { title: 'Dashboard', url: '/', icon: LayoutDashboard },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          items: [
            { title: 'Sign In', url: '/clerk/sign-in' },
            { title: 'Sign Up', url: '/clerk/sign-up' },
            { title: 'User Management', url: '/clerk/user-management' }
          ]
        }
      ]
    },
    {
      title: 'Other',
      items: [
        { title: 'Settings', url: '/settings', icon: Settings }
      ]
    }
  ]
}
`
  await fs.writeFile(sidebarPath, content)
}

async function move(src, dest) {
  try {
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.cp(src, dest, { recursive: true })
    await fs.rm(src, { recursive: true, force: true })
  } catch {
    // ignore
  }
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const title = await rl.question('Project title: ')
  const description = await rl.question('Project description: ')
  rl.close()

  const pkgPath = 'package.json'
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'))
  pkg.name = title.toLowerCase().replace(/\s+/g, '-')
  pkg.description = description
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  const indexHtmlPath = 'index.html'
  let indexHtml = await fs.readFile(indexHtmlPath, 'utf8')
  indexHtml = indexHtml.replace(/<title>.*?<\/title>/, `<title>${title}<\/title>`)
  indexHtml = indexHtml.replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`)
  await fs.writeFile(indexHtmlPath, indexHtml)

  await move('src/routes/_authenticated/tasks', 'scripts/templates/routes/tasks')
  await move('src/routes/_authenticated/users', 'scripts/templates/routes/users')
  await move('src/features/tasks', 'scripts/templates/features/tasks')
  await move('src/features/users', 'scripts/templates/features/users')

  const remove = [
    'src/routes/_authenticated/apps',
    'src/routes/_authenticated/chats',
    'src/routes/_authenticated/help-center',
    'src/features/apps',
    'src/features/chats'
  ]
  for (const p of remove) {
    await fs.rm(p, { recursive: true, force: true })
  }

  await updateSidebar()

  console.log('Template initialized')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

