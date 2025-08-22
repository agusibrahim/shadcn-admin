import fs from 'fs/promises'
import path from 'path'
import readline from 'readline/promises'
import { stdin, stdout } from 'process'

const baseMap = {
  dashboard: 'dashboard',
  tables: 'tasks',
  users: 'users',
}

async function copyTemplate(
  src,
  dest,
  baseName,
  baseComponent,
  name,
  componentName,
  title,
) {
  const stat = await fs.stat(src)
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true })
    const entries = await fs.readdir(src)
    for (const entry of entries) {
      const newSrc = path.join(src, entry)
      const newDestName = entry
        .replace(new RegExp(baseComponent, 'g'), componentName)
        .replace(new RegExp(baseName, 'g'), name)
      const newDest = path.join(dest, newDestName)
      await copyTemplate(
        newSrc,
        newDest,
        baseName,
        baseComponent,
        name,
        componentName,
        title,
      )
    }
  } else {
    let content = await fs.readFile(src, 'utf8')
    content = content
      .replace(/__NAME__/g, name)
      .replace(/__COMPONENT__/g, componentName)
      .replace(/__TITLE__/g, title)
      .replace(new RegExp(baseComponent, 'g'), componentName)
      .replace(new RegExp(baseName, 'g'), name)
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await fs.writeFile(dest, content)
  }
}

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout })
  const type = (await rl.question('Page type (dashboard|tables|users): ')).trim()
  const title = (await rl.question('Page title: ')).trim()
  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  const name = slugify(title)
  rl.close()

  const componentName = name.charAt(0).toUpperCase() + name.slice(1)
  const templateDir = path.join('scripts', 'templates', 'pages', type)
  const baseName = baseMap[type]
  const baseComponent = baseName.charAt(0).toUpperCase() + baseName.slice(1)

  await copyTemplate(
    path.join(templateDir, 'route.tsx'),
    path.join('src', 'routes', '_authenticated', name, 'index.tsx'),
    baseName,
    baseComponent,
    name,
    componentName,
    title,
  )

  await copyTemplate(
    path.join(templateDir, 'features'),
    path.join('src', 'features', name),
    baseName,
    baseComponent,
    name,
    componentName,
    title,
  )

  console.log(
    `Created ${type} page at src/routes/_authenticated/${name} and src/features/${name}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
