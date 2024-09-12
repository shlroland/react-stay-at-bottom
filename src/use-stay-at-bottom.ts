import { type RefObject, useCallback, useMemo, useRef } from 'react'
import invariant from 'tiny-invariant'

import { loopRequestAnimationFrame } from './raf'
import {
  canUseScrollTopMax,
  defaultRunScroll,
  maxScrollTop,
  useElementEvent,
  useIsomorphicLayoutEffect,
  usePersistFn,
} from './utils'

interface StayBottomOptions {
  handleScroll?: (scrollElement: HTMLElement) => void

  autoStay?: boolean

  initialStay?: boolean
}

export function useStayAtBottom(
  scrollRef: RefObject<HTMLElement>,
  options?: StayBottomOptions,
) {
  const { handleScroll, autoStay = true, initialStay = false } = options ?? {}

  const shouldStayBottom = useRef(false)
  const scrollingRaf = useRef<null | number>(null)

  const stayAtBottom = useCallback(() => {
    if (shouldStayBottom.current) return
    shouldStayBottom.current = true
  }, [])

  const stopAtBottom = useCallback(() => {
    if (!shouldStayBottom.current) return
    shouldStayBottom.current = false
  }, [])

  const scroll = usePersistFn((position: number) => {
    invariant(
      scrollRef.current !== null,
      `Trying to scroll to the bottom, but no element was found.
        Did you call this stayBottom before the component with this hook finished mounting?`,
    )

    const offset = Math.min(maxScrollTop(scrollRef.current), position)
    if (handleScroll) {
      handleScroll(scrollRef.current)
    } else {
      defaultRunScroll(scrollRef.current)(offset)
    }

    if (scrollingRaf.current != null) {
      cancelAnimationFrame(scrollingRaf.current)
    }
    scrollingRaf.current = requestAnimationFrame(() => {
      scrollingRaf.current = null
    })
  })

  const scrollToBottom = usePersistFn(() => {
    scroll(Number.POSITIVE_INFINITY)
  })

  const isAtBottom = usePersistFn(() => {
    if (scrollRef.current == null) return false

    const scrollElement = scrollRef.current

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTopMax#browser_compatibility
     */
    if (canUseScrollTopMax(scrollElement)) {
      return scrollElement.scrollTop >= scrollElement.scrollTopMax
    }

    const offset = 2
    return (
      Math.abs(
        scrollElement.scrollHeight -
          scrollElement.clientHeight -
          scrollElement.scrollTop,
      ) < offset
    )
  })

  useElementEvent(scrollRef, 'scroll', () => {
    if (!autoStay) return
    if (scrollingRaf.current != null) return
    if (isAtBottom()) {
      stayAtBottom()
    } else {
      stopAtBottom()
    }
  })

  useIsomorphicLayoutEffect(() => {
    if (initialStay) {
      stayAtBottom()
      scrollToBottom()
    }
  }, [])

  useIsomorphicLayoutEffect(
    function startGotoBottomLoop() {
      return loopRequestAnimationFrame(() => {
        if (shouldStayBottom.current && !isAtBottom()) {
          scrollToBottom()
        }
      })
    },
    [scrollToBottom, isAtBottom],
  )

  return useMemo(
    () => ({
      stayAtBottom,
      stopAtBottom,
      scrollToBottom,
      isAtBottom,
    }),
    [stayAtBottom, stopAtBottom, scrollToBottom, isAtBottom],
  )
}
