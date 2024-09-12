# react-stay-at-bottom

A React hook that keeps a scrollable element at the bottom.

## Install

```bash
npm i react-stay-at-bottom
```

## Usage

```tsx
import { useStayAtBottom } from 'react-stay-at-bottom'

function MessageList({
  children,
  messages,
}: {
  children: React.ReactNode
  messages: string[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { stayAtBottom, stopAtBottom, scrollToBottom, atBottom, scroll } =
    useStayAtBottom(scrollRef)

  return <div ref={scrollRef}>{children}</div>
}
```

## Parameters

### `scrollRef`(**Required**):

type: `React.RefObject<HTMLElement>`

description: a ref to the scrollable element.

### `options`(**Optional**):

type: `{ handleScroll?: (scrollElement: HTMLElement) => void, autoStay?: boolean, initialStay?: boolean }`

description: an object controlling the behavior of the hook:

- `handleScroll`: A function that replace the default scroll handler.
- `autoStay`: Whether to automatically stay at the bottom when the scrollable element is scrolled. Defaults to `true`.
- `initialStay`: Whether to stay at the bottom when the component is mounted. Defaults to `false`.

## Return

- `stayAtBottom`: A function that keeps the scrollable element at the bottom.
- `stopAtBottom`: A function that stops the scrollable element from being kept at the bottom.
- `scrollToBottom`: A function that scrolls the scrollable element to the bottom.
- `atBottom`: A boolean indicating whether the scrollable element is at the bottom.
- `scroll`: A function that scrolls the scrollable element to the bottom.

## License

MIT
