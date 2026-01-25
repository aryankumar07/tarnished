import { useState, useRef, useCallback } from "react"
import { getAnswer } from "../../../../lib/Gemini-clinet"

const ChatBox = () => {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = useCallback(() => {
    if (!question.trim() || isLoading) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      const currentQuestion = question
      setQuestion("")
      setIsLoading(true)
      setAnswer("")

      try {
        const data = await getAnswer(currentQuestion)
        setAnswer(data ?? "")
      } catch (error) {
        console.error(error)
        setAnswer("Sorry, something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }, [question, isLoading])

  return (
    <div className="mt-4 w-full flex flex-col gap-3 justify-start items-start">
      <div className="font-extralight text-sm text-white/70">
        <span>Ask Anything About Me, I will Answer with 95% truthness</span>
      </div>
      <div className="ml-4 w-[calc(100%-1rem)] h-auto px-4 py-3 flex justify-center items-center border border-white/20 rounded-xl bg-white/5">
        <div className="flex-1">
          <input
            onChange={(event) => setQuestion(event.target.value)}
            value={question}
            placeholder="Shoot anything..."
            disabled={isLoading}
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none placeholder:text-white/30 placeholder:font-light text-white/90 disabled:opacity-50" />
        </div>
        <button
          onClick={handleClick}
          disabled={isLoading || !question.trim()}
          className="p-2 rounded-lg bg-white/10 text-white/80 cursor-pointer hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? (
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10 9 5-5 5 5" /><path d="M4 20h7a4 4 0 0 0 4-4V4" /></svg>
          )}
        </button>
      </div>
      {answer && (
        <div className="ml-4 w-[calc(100%-1rem)] px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white/80 text-sm">
          {answer}
        </div>
      )}
    </div>
  )
}

export default ChatBox
