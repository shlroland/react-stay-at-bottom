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

Type: `React.RefObject<HTMLElement>`

Description: a ref to the scrollable element.

### `options`(**Optional**):

Type: `Object`

Description: an object controlling the behavior of the hook:

#### `handleScroll`: 

Type: `(scrollElement: HTMLElement) => void`

Description: a function that replace the default scroll handler.

#### `autoStay`: 

Type: `boolean`

default: `true`

Description: Whether to automatically stay at the bottom when the scrollable element is scrolled.

#### `initialStay`: 

Type: `boolean`

default: `false`

Description: Whether to stay at the bottom when the component is mounted.

### `scrollThreshold` (Optional):

Type: `number | 'default'`

Default: `'default'` ('default' is equivalent to 2)

Description: The scroll threshold to determine if the scrollable element is at the bottom.

Notes:

1. Why is the default value `2`?
   - See [MDN documentation - scrollHeight](https://developer.mozilla.org/docs/Web/API/Element/scrollHeight#%E5%88%A4%E6%96%AD%E5%85%83%E7%B4%A0%E6%98%AF%E5%90%A6%E6%BB%9A%E5%8A%A8%E5%88%B0%E5%BA%95)
   - When set to `'default'`, the `scrollTopMax` will be used to calculate the offset

2. What is `scrollTopMax`?
   - See [MDN documentation - scrollTopMax](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTopMax)

## Return

### `stayAtBottom`: 

Type: `() => void`

Description: A function that keeps the scrollable element at the bottom.

### `stopAtBottom`: 

Type: `() => void`

Description: A function that stops the scrollable element from being kept at the bottom.

### `scrollToBottom`: 

Type: `(behavior?: ScrollOptions['behavior']) => void`

Description: A function that scrolls the scrollable element to the bottom.

### `atBottom`: 

Type: `boolean`

Description: A boolean indicating whether the scrollable element is at the bottom.

### `scroll`: 

Type: `(behavior?: ScrollOptions['behavior']) => void`

Description: A function that scrolls the scrollable element to the bottom.

## Similar Projects

- [react-stay-scrolled](https://github.com/dotcore64/react-stay-scrolled)

## License

MIT
