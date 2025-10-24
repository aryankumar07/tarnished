import { promises as fs } from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const blogDirPath = path.join(process.cwd(), 'src/app/blog/(blogs)');
    const fileNames = await fs.readdir(blogDirPath);

    const mdFiles = fileNames.filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

    const promises = mdFiles.map(async (fileName) => {
      const filePath = path.join(blogDirPath, fileName);
      const raw = await fs.readFile(filePath, 'utf-8');

      const { frontmatter } = await compileMDX<{ title?: string; imgUrl?: string }>({
        source: raw,
        options: { parseFrontmatter: true },
      });

      const slug = fileName.replace(/\.(mdx?|MDX?)$/, '');

      return {
        fileName,
        slug,
        title: frontmatter?.title ?? null,
        imgUrl: frontmatter?.imgUrl ?? null,
      };
    });
    const data = await Promise.all(promises);
    return NextResponse.json({ data });
  } catch (err) {
    console.error('Failed to read blog dir', err);
    return NextResponse.json({ data: null, error: String(err) }, { status: 500 });
  }
}
