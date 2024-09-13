import { useState } from 'react'

import { Sidebar, SidebarItem } from './components/sidebar'
import { AutoStay } from './routes/auto-stay'
import { ManualStay } from './routes/manual-stay'
import { ButtonIndicator } from './routes/button-indicator'

function App() {
  const [selected, setSelected] = useState(1)

  return (
    <main className="bg-muted/50 flex h-dvh flex-1 flex-col">
      <Sidebar>
        <SidebarItem selected={selected === 1} onClick={() => setSelected(1)}>
          auto stay(with initial stay)
        </SidebarItem>
        <SidebarItem selected={selected === 2} onClick={() => setSelected(2)}>
          manual stay(with initial stay)
        </SidebarItem>
        <SidebarItem selected={selected === 3} onClick={() => setSelected(3)}>
          auto stay(without initial stay)
        </SidebarItem>
        <SidebarItem selected={selected === 4} onClick={() => setSelected(4)}>
          manual stay(without initial stay)
        </SidebarItem>
        <SidebarItem selected={selected === 5} onClick={() => setSelected(5)}>
          button indicator
        </SidebarItem>
      </Sidebar>
      {selected === 1 && <AutoStay initialStay={true} />}
      {selected === 2 && <ManualStay initialStay={true} />}
      {selected === 3 && <AutoStay initialStay={false} />}
      {selected === 4 && <ManualStay initialStay={false} />}
      {selected === 5 && <ButtonIndicator initialStay={true} />}
    </main>
  )
}

export default App
