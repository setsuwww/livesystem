import Link from 'next/link'

interface AuthLink {
  className?: string
  question?: string
  href: string
  link: string
}

export default function AuthLink({ className = "", question, link, href }: AuthLink) {
  return (
    <p className={`${className} font-medium text-sm text-center text-gray-500 whitespace-nowrap`}>
      {question}{' '}
      <Link href={href} className="text-sky-500 hover:text-sky-600 whitespace-nowrap">
        {link}
      </Link>
    </p>
  )
}