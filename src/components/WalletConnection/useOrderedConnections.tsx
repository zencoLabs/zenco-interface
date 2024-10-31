import { connections, eip6963Connection } from '@/src/connection'
import { useInjectedProviderDetails } from '@/src/connection/eip6963/providers'
import { Connection } from '@/src/connection/types'
import { shouldUseDeprecatedInjector } from '@/src/connection/utils' 
import { useMemo } from 'react' 

function useEIP6963Connections() {
  const injectedDetailsMap = useInjectedProviderDetails()
  const eip6963Enabled = true

  return useMemo(() => {
    if (!eip6963Enabled) return { eip6963Connections: [], showDeprecatedMessage: false }

    const eip6963Injectors = Array.from(injectedDetailsMap.values())  
    const eip6963Connections = eip6963Injectors.flatMap((injector) => eip6963Connection.wrap(injector.info) ?? [])

    // Displays ui to activate window.ethereum for edge-case where we detect window.ethereum !== one of the eip6963 providers
    const showDeprecatedMessage = eip6963Connections.length > 0 && shouldUseDeprecatedInjector(injectedDetailsMap)

    return { eip6963Connections, showDeprecatedMessage }
  }, [injectedDetailsMap, eip6963Enabled])
}

export function mergeConnections(connections: Connection[], eip6963Connections: Connection[]) {
  const hasEip6963Connections = eip6963Connections.length > 0
  const displayedConnections = connections.filter((c) => c.shouldDisplay())

  if (!hasEip6963Connections) return displayedConnections

  const allConnections =displayedConnections // [...displayedConnections.filter((c) => c.type !== ConnectionType.INJECTED)] 
  // By default, injected options should appear second in the list (below Uniswap wallet)
  allConnections.splice(1, 0, ...eip6963Connections)

  return allConnections
}
 
export function useOrderedConnections() {
  const { eip6963Connections, showDeprecatedMessage } = useEIP6963Connections()
  const recentConnection = undefined //useAppSelector((state) => state.user.recentConnectionMeta)
  const orderedConnections = useMemo(() => {
    const allConnections = mergeConnections(connections, eip6963Connections) 
    return allConnections
  }, [eip6963Connections, recentConnection])

  return { orderedConnections, showDeprecatedMessage }
}
