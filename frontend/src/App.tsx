import { Home } from './pages/Home'
import { TooltipProvider } from './components/ui/tooltip'

function App() {
  return (
    <TooltipProvider delayDuration={250}>
      <Home />
    </TooltipProvider>
  )
}

export default App
