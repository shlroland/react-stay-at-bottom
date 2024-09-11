import memoize from 'memoize-one'
import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'

/**
 * @internal
 */
export const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * @internal
 */
export const defaultRunScroll = memoize(
  (domRef: HTMLElement) => (offset: number) => {
    domRef.scrollTop = offset
  },
)

/**
 * @internal
*/
export function maxScrollTop(dom: HTMLElement) {
  return dom.scrollHeight - dom.clientHeight
}

/**
 * @internal
*/
export function useElementEvent<K extends keyof HTMLElementEventMap>(
  target: RefObject<HTMLElement | null | undefined>,
  eventName: K,
  listener: (ev: HTMLElementEventMap[K]) => void,
): void {
  useEffect(() => {
    const _target = target.current
    if (!_target) return

    _target.addEventListener(eventName, listener)
    return () => _target.removeEventListener(eventName, listener)
  }, [eventName, listener, target])
}

/**
 * @internal
*/
export function canUseScrollTopMax<T extends Element>(
  elm: T,
): elm is T & { scrollTopMax: number } {
  return typeof (elm as { scrollTopMax?: unknown }).scrollTopMax === 'number'
}

/**
 * @internal
*/
export function usePersistFn<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (this: any, ...args: any[]) => any,
>(fn: T): T {
  const fnRef = useRef<T>(fn)
  fnRef.current = fn

  const persistFn = useRef<T>()
  if (!persistFn.current) {
    persistFn.current = function (...args) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fnRef.current.apply(this, args)
    } as T
  }

  return persistFn.current
}
