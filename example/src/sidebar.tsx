import { type PropsWithChildren } from 'react'
import { cn } from './cn'

export function Sidebar(props: PropsWithChildren) {
  return (
    <div className="relative flex h-full overflow-hidden">
      <div className="peer absolute inset-y-0 z-30 hidden border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px] h-full flex-col dark:bg-zinc-950">
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto py-8 space-y-2">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SidebarItem(props: PropsWithChildren<{ selected?: boolean }>) {
  return (
    <>
      <div className="space-y-2 px-2">
        <div>
          <div className="relative h-8">
            <div
              className={cn(
                'inline-flex items-center whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10 cursor-pointer',
                props.selected ? 'bg-zinc-200/40 dark:bg-zinc-300/10' : '',
              )}
            >
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}