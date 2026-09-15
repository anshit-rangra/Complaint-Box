import { useState } from "react"


const WORD_LIMIT = 20


export const ReadMoreText = ({ text }) => {
  const [expanded, setExpanded] = useState(false)
  const words = text?.split(' ') || []

  if (words.length <= WORD_LIMIT) {
    return <p className="mt-1 text-sm leading-relaxed text-slate-400">{text}</p>
  }

  const truncated = expanded ? text : words.slice(0, WORD_LIMIT).join(' ') + '...'

  return (
    <p className="mt-1 text-sm leading-relaxed text-slate-400">
      {truncated}
      <button
        type="button"
        onClick={() => setExpanded(prev => !prev)}
        className="ml-1 cursor-pointer font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
      >
        {expanded ? 'show less' : 'read more'}
      </button>
    </p>
  )
}