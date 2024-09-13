import { Sidebar, SidebarItem } from './sidebar'

function App() {
  return (
    <main className="bg-muted/50 flex h-dvh flex-1 flex-col">
      <Sidebar>
        <SidebarItem selected>auto stay</SidebarItem>
        <SidebarItem>manual stay</SidebarItem>
      </Sidebar>
    </main>
  )
}

export default App
