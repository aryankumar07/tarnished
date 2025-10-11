import Link from "next/link"
import { cn } from "../lib/utils"

const LinkPremative = ({
  href,
  external,
  children,
  className
}: {
  href: string,
  external: boolean,
  children: React.ReactNode,
  className?: string
}) => {

  const Component = external ? 'a' : Link

  return (
    <Component
      href={href}
      className={cn(className)}
      target={external ? "_blank" : undefined}
    >
      {children}
    </Component>
  )
}

export default LinkPremative
