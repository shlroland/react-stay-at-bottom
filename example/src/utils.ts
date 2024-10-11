import type { ChatMessageProps } from './components/chat'
import { faker } from '@faker-js/faker'
import { type ClassValue, clsx } from 'clsx'
import { nanoid } from 'nanoid/non-secure'
import { type DependencyList, type EffectCallback, useEffect, useRef, useState } from 'react'

import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function initMessages(): ChatMessageProps[] {
  return [
    {
      role: 'user',
      id: nanoid(),
      content: 'What is your name?',
    },
    {
      role: 'bot',
      id: nanoid(),
      content: `My name is ${faker.person.fullName()}.`,
    },
    {
      role: 'user',
      id: nanoid(),
      content: 'What is your job?',
    },
    {
      role: 'bot',
      id: nanoid(),
      content: `I am a ${faker.person.jobTitle()}.`,
    },
    {
      role: 'user',
      id: nanoid(),
      content: 'What is your address?',
    },
    {
      role: 'bot',
      id: nanoid(),
      content: `I live in ${faker.location.city()}, ${faker.location.state()}, ${faker.location.country()}.`,
    },
    {
      role: 'user',
      id: nanoid(),
      content: 'What is your phone number?',
    },
    {
      role: 'bot',
      id: nanoid(),
      content: `My phone number is ${faker.phone.number()}.`,
    },
    {
      role: 'user',
      id: nanoid(),
      content: 'What is your email?',
    },
    {
      role: 'bot',
      id: nanoid(),
      content: `My email is ${faker.internet.email()}.`,
    },
    {
      role: 'user',
      id: nanoid(),
      content: 'What is your website?',
    },
    {
      role: 'bot',
      id: nanoid(),
      content: `My website is ${faker.internet.url()}.`,
    },
    {
      role: 'user',
      id: nanoid(),
      content: 'Can you tell me a joke?',
    },
    {
      role: 'bot',
      id: nanoid(),
      content: `Why don't scientists trust atoms? Because they make up everything!`,
    },
    {
      role: 'user',
      id: nanoid(),
      content: 'What is the meaning of life?',
    },
    {
      role: 'bot',
      id: nanoid(),
      content: `The meaning of life is ${faker.lorem.sentence(100)}.`,
    },
  ] as ChatMessageProps[]
}

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList): void {
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    }
    else {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
