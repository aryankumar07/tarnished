"use client"

import { useState, useRef, useCallback, useEffect } from "react"

const ChatBox = () => {
  const [question, setQuestion] = useState("")
  const [displayedText, setDisplayedText] = useState("") // What's shown to user
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isError, setIsError] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Buffer for incoming text and animation state
  const textBufferRef = useRef("")
  const displayedIndexRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  // Word-by-word animation effect
  useEffect(() => {
    if (!isStreaming && displayedIndexRef.current >= textBufferRef.current.length) {
      return
    }

    const animateText = () => {
      const buffer = textBufferRef.current
      const currentIndex = displayedIndexRef.current

      if (currentIndex < buffer.length) {
        // Find the next word boundary (space or end of buffer)
        let nextIndex = currentIndex

        // Skip to next space or end
        while (nextIndex < buffer.length && buffer[nextIndex] !== " ") {
          nextIndex++
        }
        // Include the space
        if (nextIndex < buffer.length) {
          nextIndex++
        }

        displayedIndexRef.current = nextIndex
        setDisplayedText(buffer.slice(0, nextIndex))

        // Schedule next word with delay (adjust for speed)
        animationFrameRef.current = window.setTimeout(animateText, 50) as unknown as number
      } else if (isStreaming) {
        // Buffer caught up, wait for more data
        animationFrameRef.current = window.setTimeout(animateText, 30) as unknown as number
      }
    }

    animationFrameRef.current = window.setTimeout(animateText, 50) as unknown as number

    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current)
      }
    }
  }, [isStreaming])

  const handleClick = useCallback(() => {
    if (!question.trim() || isLoading) return

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      clearTimeout(animationFrameRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      const currentQuestion = question
      setQuestion("")
      setIsLoading(true)
      setIsStreaming(true)
      setDisplayedText("")
      setIsError(false)

      // Reset buffer and index
      textBufferRef.current = ""
      displayedIndexRef.current = 0

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: currentQuestion }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          if (response.status === 429 || errorData.error === "rate_limit") {
            throw new Error("rate_limit")
          }
          throw new Error(errorData.message || "Request failed")
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        if (!reader) throw new Error("No response body")

        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          // Decode the chunk and add to buffer
          const chunk = decoder.decode(value, { stream: true })
          textBufferRef.current += chunk
        }

        // Mark streaming as done, animation will continue until buffer is exhausted
        setIsStreaming(false)

        // Wait for animation to finish displaying remaining buffer
        const waitForAnimation = () => {
          if (displayedIndexRef.current >= textBufferRef.current.length) {
            setDisplayedText(textBufferRef.current)
          } else {
            setTimeout(waitForAnimation, 50)
          }
        }
        waitForAnimation()

      } catch (error) {
        // Don't show error if request was cancelled
        if (error instanceof Error && error.name === "AbortError") {
          return
        }

        console.error(error)
        setIsError(true)
        setIsStreaming(false)

        if (error instanceof Error && error.message === "rate_limit") {
          setDisplayedText("Oops! Too many questions. Please try again later.")
        } else {
          setDisplayedText("Sorry, something went wrong. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [question, isLoading])

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleClick()
    }
  }

  // Check if animation is still running (buffer has more content than displayed)
  const isAnimating = displayedIndexRef.current < textBufferRef.current.length || isStreaming

  return (
    <div className="mt-4 w-full flex flex-col gap-3 justify-start items-start">
      <div className="font-extralight text-sm text-white/70">
        <span>Ask Anything About Me, I will Answer with 95% truthness</span>
      </div>
      <div className="ml-4 w-[calc(100%-1rem)] h-auto px-4 py-3 flex justify-center items-center border border-white/20 rounded-xl bg-white/5">
        <div className="flex-1">
          <input
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleKeyDown}
            value={question}
            placeholder="Shoot anything..."
            disabled={isLoading}
            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none placeholder:text-white/30 placeholder:font-light text-white/90 disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleClick}
          disabled={isLoading || !question.trim()}
          className="p-2 rounded-lg bg-white/10 text-white/80 cursor-pointer hover:bg-white/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m10 9 5-5 5 5" />
              <path d="M4 20h7a4 4 0 0 0 4-4V4" />
            </svg>
          )}
        </button>
      </div>
      {(displayedText || isStreaming) && (
        <div
          className={`ml-4 w-[calc(100%-1rem)] px-4 py-3 rounded-xl text-sm ${
            isError
              ? "border border-red-500/30 bg-red-500/10 text-red-300"
              : "border border-white/20 bg-white/5 text-white/80"
          }`}
        >
          {displayedText}
          {/* Blinking cursor while streaming or animating */}
          {(isStreaming || isAnimating) && !isError && (
            <span className="inline-block w-[2px] h-[1em] bg-white/80 ml-[2px] align-middle animate-pulse" />
          )}
        </div>
      )}
    </div>
  )
}

export default ChatBox
