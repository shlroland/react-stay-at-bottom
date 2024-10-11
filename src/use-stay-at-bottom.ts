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

  /**
   * The scroll threshold to determine if the scrollable element is at the bottom.
   * @default 'default' - 'default' is 2
   *
   * @note why default is 2?
   * @see https://developer.mozilla.org/docs/Web/API/Element/scrollHeight#%E5%88%A4%E6%96%AD%E5%85%83%E7%B4%A0%E6%98%AF%E5%90%A6%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95
   * when set to `'default'`, the `scrollTopMax` will be used to calculate the offset
   *
   * @note what is `scrollTopMax` ?
   * @see  https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTopMax
   */
  scrollThreshold?: number | 'default'
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
  const {
    handleScroll,
    autoStay = true,
    initialStay = false,
    scrollThreshold = 'default',
  } = options ?? {}

  const shouldStayBottom = useRef(false)
  const scrollingRaf = useRef<null | number>(null)

  const [atBottom, setAtBottom] = useState(false)

  const stayAtBottom = useCallback(() => {
    if (shouldStayBottom.current)
      return
    shouldStayBottom.current = true
  }, [])

  const stopAtBottom = useCallback(() => {
    if (!shouldStayBottom.current)
      return
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
      }
      else {
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
    if (scrollThreshold === 'default' && canUseScrollTopMax(scrollElement)) {
      result = scrollElement.scrollTop >= scrollElement.scrollTopMax
      setAtBottom(result)
      return result
    }

    const offset = scrollThreshold === 'default' ? 2 : scrollThreshold
    result
      = Math.abs(
        scrollElement.scrollHeight
        - scrollElement.clientHeight
        - scrollElement.scrollTop,
      ) < offset
    setAtBottom(result)
    return result
  })

  useElementEvent(scrollRef, 'scroll', () => {
    if (!autoStay)
      return
    if (scrollingRaf.current != null)
      return
    if (isAtBottom()) {
      stayAtBottom()
    }
    else {
      stopAtBottom()
    }
  })

  useIsomorphicLayoutEffect(() => {
    if (initialStay) {
      if (autoStay) {
        stayAtBottom()
      }
      scrollToBottom()
    }
  }, [])

  useIsomorphicLayoutEffect(
    () => {
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
