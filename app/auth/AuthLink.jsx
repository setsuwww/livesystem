import Link from 'next/link'

export default function AuthLink({
  className = "",
  question,
  link,
  href
}) {
  return (
    <p className={`${className} font-medium text-sm text-center text-zinc-500 whitespace-nowrap`}>
      {question}{' '}
      <Link href={href} className="text-sky-500 hover:text-sky-600 whitespace-nowrap">
        {link}
      </Link>
    </p>
  )
}