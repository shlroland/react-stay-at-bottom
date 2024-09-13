# react-stay-at-bottom

A React hook that keeps a scrollable element at the bottom. 

Typical scenario: 

- web IM chat 
- ai chat bot

![NPM Version](https://img.shields.io/npm/v/react-stay-at-bottom)


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

## Live Demo

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/shlroland/react-stay-at-bottom/tree/main/example?file=src%2Fcomponents%2Fsidebar.tsx)

## Parameters

### `scrollRef`(**Required**):

type: `React.RefObject<HTMLElement>`

description: a ref to the scrollable element.

### `options`(**Optional**):

type: `{ handleScroll?: (scrollElement: HTMLElement) => void, autoStay?: boolean, initialStay?: boolean }`

description: an object controlling the behavior of the hook:

#### `handleScroll`: 

type: `(scrollElement: HTMLElement) => void`

description: a function that replace the default scroll handler.

#### `autoStay`: 

type: `boolean`

default: `true`

description: Whether to automatically stay at the bottom when the scrollable element is scrolled.

#### `initialStay`: 

type: `boolean`

default: `false`

description: Whether to stay at the bottom when the component is mounted.

## Return

### `stayAtBottom`: 

type: `() => void`

description: A function that keeps the scrollable element at the bottom.

### `stopAtBottom`: 

type: `() => void`

description: A function that stops the scrollable element from being kept at the bottom.

### `scrollToBottom`: 

type: `(behavior?: ScrollOptions['behavior']) => void`

description: A function that scrolls the scrollable element to the bottom.

### `atBottom`: 

type: `boolean`

description: A boolean indicating whether the scrollable element is at the bottom.

### `scroll`: 

type: `(behavior?: ScrollOptions['behavior']) => void`

description: A function that scrolls the scrollable element to the bottom.

## Similar Projects

- [react-stay-scrolled](https://github.com/dotcore64/react-stay-scrolled)

## License

MIT
