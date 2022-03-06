import React from 'react'
import { 
  Box,
} from "@chakra-ui/react"
import PlugConnect from '@psychedelic/plug-connect';

interface Props {
  plugConnected: boolean,
  network: string,
  whitelist: string[],
  handleConnect: () => Promise<void>,
}

const Header: React.FC<Props> = ({plugConnected, network, whitelist, handleConnect}) => {
  return (
    <Box m={30}>
      {plugConnected ? `My tasks`: (
        <Box>
          <PlugConnect
            host={network}
            whitelist={whitelist}
            dark
            onConnectCallback={handleConnect}
          />
          <Box mt={30}>
            Global tasks
          </Box>
          
        </Box>
      )}
    </Box>
  )
}

export default Header
