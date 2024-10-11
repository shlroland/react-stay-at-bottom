import { faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'
import { useRef, useState } from 'react'
import { useStayAtBottom } from 'react-stay-at-bottom'

import { Chat, ChatInput, type ChatMessageProps } from '../components/chat'
import { initMessages, sleep, useUpdateEffect } from '../utils'

export function ManualStay({ initialStay }: { initialStay: boolean }): JSX.Element {
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

  const { scrollToBottom } = useStayAtBottom(scrollRef, {
    initialStay,
    autoStay: false,
  })

  useUpdateEffect(() => {
    scrollToBottom()
  }, [messages.length])

  return (
    <>
      <Chat messages={messages} ref={scrollRef}></Chat>
      <ChatInput sendMessage={handleSendMessage} />
    </>
  )
}
