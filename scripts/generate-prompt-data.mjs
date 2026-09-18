import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const splitSourcePaths = [
  resolve(root, 'README_vi-VN.part1.md'),
  resolve(root, 'README_vi-VN.part2.md'),
]
const sourcePaths = splitSourcePaths.every(existsSync)
  ? splitSourcePaths
  : [resolve(root, 'README_vi-VN.md')]
const outputPaths = [
  resolve(root, 'src/data/prompts-1.json'),
  resolve(root, 'src/data/prompts-2.json'),
]
const source = sourcePaths.map((path) => readFileSync(path, 'utf8')).join('\n')

const cleanMarkdown = (value = '') => value
  .replace(/<[^>]+>/g, ' ')
  .replace(/\[([^\]]+)]\([^\)]+\)/g, '$1')
  .replace(/\*\*/g, '')
  .replace(/\s+/g, ' ')
  .trim()

const slugify = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const between = (block, start, end) => {
  const startIndex = block.indexOf(start)
  if (startIndex < 0) return ''
  const contentStart = startIndex + start.length
  const endIndex = block.indexOf(end, contentStart)
  return block.slice(contentStart, endIndex < 0 ? undefined : endIndex).trim()
}

const entries = source
  .split(/(?=^### No\. \d+: )/m)
  .filter((block) => /^### No\. \d+: /m.test(block))
  .map((block, index) => {
    const heading = block.match(/^### No\. (\d+): (.+)$/m)
    const rawTitle = heading?.[2]?.trim() ?? `Prompt ${index + 1}`
    const isFeatured = block.includes('Featured-gold')
    const titleParts = rawTitle.split(' - ')
    const inferredCategory = titleParts.length > 1 ? titleParts.shift()?.trim() : ''
    const title = titleParts.length ? titleParts.join(' - ').trim() : rawTitle
    const category = isFeatured ? 'Nổi bật' : inferredCategory || 'Khám phá'
    const description = cleanMarkdown(between(block, '#### 📖 Mô tả', '#### 📝 Câu lệnh'))
    const promptSection = between(block, '#### 📝 Câu lệnh', '#### 🖼️ Hình ảnh được tạo')
    const prompt = promptSection.match(/```(?:\w+)?\n([\s\S]*?)\n```/)?.[1]?.trim() ?? ''
    const imageSection = between(block, '#### 🖼️ Hình ảnh được tạo', '#### 📌 Chi tiết')
    const images = [...imageSection.matchAll(/<img src="([^"]+)"/g)].map((match) => match[1])
    const authorMatch = block.match(/- \*\*Tác giả:\*\* \[([^\]]+)]\(([^\)]+)\)/)
    const sourceMatch = block.match(/- \*\*Nguồn:\*\* \[([^\]]+)]\(([^\)]+)\)/)
    const published = block.match(/- \*\*Đã xuất bản:\*\* (.+)$/m)?.[1]?.trim() ?? ''
    const language = block.match(/- \*\*Ngôn ngữ:\*\* (.+)$/m)?.[1]?.trim() ?? '—'
    const tryLink = block.match(/\*\*\[👉 Thử ngay →]\(([^\)]+)\)\*\*/)?.[1] ?? ''

    return {
      id: `${slugify(rawTitle)}-${index + 1}`,
      number: Number(heading?.[1] ?? index + 1),
      title,
      rawTitle,
      category,
      description,
      prompt,
      images,
      author: authorMatch ? { name: authorMatch[1], url: authorMatch[2] } : null,
      source: sourceMatch ? { name: sourceMatch[1], url: sourceMatch[2] } : null,
      published,
      language,
      tryLink,
      featured: isFeatured,
      raycastFriendly: block.includes('Raycast_Friendly'),
    }
  })
  .filter((entry) => entry.prompt && entry.images.length)

mkdirSync(dirname(outputPaths[0]), { recursive: true })
const midpoint = Math.ceil(entries.length / 2)
const chunks = [entries.slice(0, midpoint), entries.slice(midpoint)]
for (let index = 0; index < outputPaths.length; index += 1) {
  writeFileSync(outputPaths[index], `${JSON.stringify(chunks[index], null, 2)}\n`)
}
console.log(`Generated ${entries.length} prompts → ${outputPaths.join(', ')}`)
