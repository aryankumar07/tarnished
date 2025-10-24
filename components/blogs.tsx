'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface dataProps {
  filename: string,
  slug: string,
  title: string,
  imgUrl: string
}

const Blogs = ({ setIsLoading }: { setIsLoading: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [blogData, setBlogData] = useState<dataProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    let mounted = true;
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        console.log(data.data)
        if (data.data) setBlogData(data.data);
        else setError(data?.error || 'Unexpected response');
      })
      .catch(err => {
        if (!mounted) return;
        console.error(err);
        setError(String(err));
      });
    return () => { mounted = false; };
  }, []);

  const handleClick = (blogSlug: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/blog/${blogSlug}`)
    }, 800)
  }

  return (
    <div className="flex flex-col justify-start items-start gap-3">
      <h1 className="text-foreground/50">Blogs</h1>
      <p className="text-justify">
        I write about coding with a curious heart — sharing lessons, little hacks, and the stories behind the screens so other makers can learn and be inspired.
      </p>
      {error && <p className="text-red-400 text-sm">Error loading blogs: {error}</p>}
      {blogData === null && !error && <p className="text-sm">Loading…</p>}
      <div className='w-full flex p-1 gap-1 overflow-x-scroll hover:cursor-pointer'>
        {blogData && blogData.map((data, index) => {
          return (
            <div onClick={() => handleClick(data.slug)} key={index} className='w-40 h-40 shrink-0 bg-red-400 overflow-hidden'>
              <img src={data.imgUrl} className='w-full h-full' alt={data.title} />
            </div>
          )
        })
        }
      </div>
    </div>
  );
};

export default Blogs;
