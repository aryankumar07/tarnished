import { promises as fs } from 'fs'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'



export async function generateMetadata({ params }: { params: { blogSlug: string } }) {
  try {
    const filePath = path.join(process.cwd(), 'src/app/blog/(blogs)', `${params.blogSlug}.mdx`)
    const raw = await fs.readFile(filePath, 'utf-8')
    const { frontmatter } = await compileMDX<{ title: string }>({
      source: raw,
      options: {
        parseFrontmatter: true
      }
    })
    return {
      title: `${frontmatter.title}`
    }
  } catch (e) {
    console.error(e)
  }
};

const Page = async ({ params }: { params: { blogSlug: string } }) => {
  let data;
  try {
    const filePath = path.join(process.cwd(), 'src/app/blog/(blogs)', `${params.blogSlug}.mdx`)
    const raw = await fs.readFile(filePath, 'utf-8')
    data = await compileMDX<{ title: string }>({
      source: raw,
      options: {
        parseFrontmatter: true
      }
    })
  } catch (e) {
    console.error(e)
    return
  }

  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.55))',
    WebkitBackdropFilter: 'blur(6px) saturate(120%)',
    backdropFilter: 'blur(6px) saturate(120%)',
    WebkitMaskImage: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)',
    maskImage: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)',
  }


  return (
    <div className="flex p-8 w-full">
      <div className="relative w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none" style={overlayStyle} aria-hidden="true" />
        <div className="relative z-20 p-8 bg-black/60">
          {data.content}
        </div>
      </div>
    </div>

  )
}

export default Page
