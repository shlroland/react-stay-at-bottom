import { forwardRef, type RefObject, useRef, useState } from 'react'

import { IconArrowElbow, IconRobot, IconUser } from './icons'

export interface ChatProps {
  messages: ChatMessageProps[]
}

export const Chat = forwardRef<HTMLDivElement, ChatProps>(
  ({ messages }, ref) => {
    return (
      <div
        className="group w-full overflow-auto pl-[250px] lg:pl-[300px]"
        ref={ref}
      >
        <div className="pb-[200px] pt-4 md:pt-10">
          <div className="relative mx-auto max-w-2xl px-4">
            {messages.map((message, index) => (
              <div key={message.id}>
                <ChatMessage {...message} />
                {index < messages.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
)

Chat.displayName = 'Chat'

export interface ChatMessageProps {
  role: 'user' | 'bot'
  content: string
  id: string
}

function ChatMessage({ role, content }: ChatMessageProps): JSX.Element {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
        {role === 'user' ? <IconUser /> : <IconRobot />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {content}
      </div>
    </div>
  )
}

function Separator(): JSX.Element {
  return <div className="shrink-0 bg-border h-[1px] w-full my-4"></div>
}

interface ChatInputProps {
  sendMessage: (message: string) => void
}

export function ChatInput({ sendMessage }: ChatInputProps): JSX.Element {
  const [input, setInput] = useState('')

  const handleSendMessage = (): void => {
    sendMessage(input)
    setInput('')
  }

  return (
    <div className="from-muted/30 to-muted/30 animate-in dark:from-background/10 dark:to-background/80 fixed inset-x-0 bottom-0 w-full duration-300 ease-in-out pl-[250px] lg:pl-[300px] dark:from-10%">
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="bg-background space-y-4 border-t px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <div className="bg-background relative flex max-h-16 w-full grow flex-col overflow-hidden pr-8 sm:rounded-md sm:border sm:pr-6">
            <textarea
              className="min-h-[60px] w-full resize-none bg-transparent px-4 py-5 focus-within:outline-none sm:text-sm"
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter'
                  && !event.shiftKey
                  && !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  handleSendMessage()
                }
              }}
            >
            </textarea>
            <div className="absolute right-0 top-[13px] sm:right-4">
              <button
                type="button"
                onClick={handleSendMessage}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 w-9"
              >
                <IconArrowElbow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useEnterSubmit(): {
  formRef: RefObject<HTMLFormElement>
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
} {
  const formRef = useRef<HTMLFormElement>(null)

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (
      event.key === 'Enter'
      && !event.shiftKey
      && !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit()
      event.preventDefault()
    }
  }

  return { formRef, onKeyDown: handleKeyDown }
}
