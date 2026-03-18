import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface GameExitWrapperProps {
  children: (props: { onExit: () => void }) => ReactNode
}

export function GameExitWrapper({ children }: GameExitWrapperProps) {
  const navigate = useNavigate()
  
  const handleExit = () => {
    // Store that we're coming from kids zone
    sessionStorage.setItem('fromKidsZone', 'true')
    navigate('/kids')
  }
  
  return <>{children({ onExit: handleExit })}</>
}
