import { type RefObject, useCallback, useMemo, useRef, useState } from 'react'
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
  /**
   * A function that replace the default scroll handler.
   * @param scrollElement - The scrollable element.
   * @default undefined
   */
  handleScroll?: (scrollElement: HTMLElement) => void

  /**
   * Whether to automatically stay at the bottom when the scrollable element is scrolled.
   * @default true
   */
  autoStay?: boolean

  /**
   * Whether to stay at the bottom when the component is mounted.
   * @default false
   */
  initialStay?: boolean
}

interface StayBottomReturn {
  /**
   * A function that keep the scrollable element at the bottom.
   */
  stayAtBottom: () => void

  /**
   * A function that stop the scrollable element from staying at the bottom.
   */
  stopAtBottom: () => void

  /**
   * A function that scroll the scrollable element to the bottom.
   * @param behavior - The behavior of the scroll.
   */
  scrollToBottom: (behavior?: ScrollOptions['behavior']) => void

  /**
   * Whether the scrollable element is at the bottom.
   */
  atBottom: boolean

  /**
   * Whether the scrollable element is at the bottom.
   */
  isAtBottom: () => boolean

  /**
   * A function that scroll the scrollable element to the bottom.
   * @param position - The offset to scroll.
   * @param behavior - The behavior of the scroll.
   */
  scroll: (position: number, behavior?: ScrollOptions['behavior']) => void
}

export function useStayAtBottom(
  scrollRef: RefObject<HTMLElement>,
  options?: StayBottomOptions,
): StayBottomReturn {
  const { handleScroll, autoStay = true, initialStay = false } = options ?? {}

  const shouldStayBottom = useRef(false)
  const scrollingRaf = useRef<null | number>(null)

  const [atBottom, setAtBottom] = useState(false)

  const stayAtBottom = useCallback(() => {
    if (shouldStayBottom.current) return
    shouldStayBottom.current = true
  }, [])

  const stopAtBottom = useCallback(() => {
    if (!shouldStayBottom.current) return
    shouldStayBottom.current = false
  }, [])

  const scroll = usePersistFn(
    (position: number, behavior?: ScrollOptions['behavior']) => {
      invariant(
        scrollRef.current !== null,
        `Trying to scroll to the bottom, but no element was found.
        Did you call this stayBottom before the component with this hook finished mounting?`,
      )

      const offset = Math.min(maxScrollTop(scrollRef.current), position)
      if (handleScroll) {
        handleScroll(scrollRef.current)
      } else {
        defaultRunScroll(scrollRef.current)(offset, behavior)
      }

      if (scrollingRaf.current != null) {
        cancelAnimationFrame(scrollingRaf.current)
      }
      scrollingRaf.current = requestAnimationFrame(() => {
        scrollingRaf.current = null
      })
    },
  )

  const scrollToBottom = usePersistFn(
    (behavior?: ScrollOptions['behavior']) => {
      scroll(Number.POSITIVE_INFINITY, behavior)
    },
  )

  const isAtBottom = usePersistFn(() => {
    let result: boolean
    if (scrollRef.current == null) {
      result = false
      setAtBottom(result)
      return result
    }

    const scrollElement = scrollRef.current

    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTopMax#browser_compatibility
     */
    if (canUseScrollTopMax(scrollElement)) {
      result = scrollElement.scrollTop >= scrollElement.scrollTopMax
      setAtBottom(result)
      return result
    }

    const offset = 2
    result =
      Math.abs(
        scrollElement.scrollHeight -
          scrollElement.clientHeight -
          scrollElement.scrollTop,
      ) < offset
    setAtBottom(result)
    return result
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
        if (!isAtBottom() && shouldStayBottom.current) {
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
      atBottom,
      isAtBottom,
      scroll,
    }),
    [stayAtBottom, stopAtBottom, scrollToBottom, atBottom, isAtBottom, scroll],
  )
}
