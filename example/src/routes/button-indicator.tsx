import { faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { useStayAtBottom } from 'react-stay-at-bottom'

import { Chat, ChatInput, type ChatMessageProps } from '../components/chat'
import { IconArrowDown } from '../components/icons'
import { initMessages, sleep, useDebounce } from '../utils'

function ArrowButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-9 w-9 absolute right-14 bottom-20 z-10 bg-background transition-opacity duration-300 sm:right-16 md:bottom-18 opacity-100"
    >
      <IconArrowDown />
    </button>
  )
}

export function ButtonIndicator({ initialStay }: { initialStay: boolean }): JSX.Element {
  const [messages, setMessages] = useState<ChatMessageProps[]>(initMessages())

  const handleSendMessage = async (message: string): Promise<void> => {
    setMessages(msgs => [
      ...msgs,
      { role: 'user', id: nanoid(), content: message },
    ])
    await sleep(1000)
    setMessages(msgs => [
      ...msgs,
      {
        role: 'bot',
        id: nanoid(),
        content: faker.lorem.paragraphs(Math.floor((Math.random() + 1) * 5)),
      },
    ])
  }

  const scrollRef = useRef<HTMLDivElement>(null)

  const { atBottom, scrollToBottom } = useStayAtBottom(scrollRef, {
    initialStay,
    autoStay: true,
  })

  const debouncedIsAtBottom = useDebounce(atBottom, 100)

  return (
    <>
      <Chat messages={messages} ref={scrollRef}></Chat>
      <ChatInput sendMessage={handleSendMessage} />
      {!debouncedIsAtBottom && <ArrowButton onClick={() => scrollToBottom('smooth')} />}
    </>
  )
}
