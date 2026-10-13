import React, { useState, createContext, useContext } from 'react'
export const ConfigFileContext = createContext()

export const ConfigFileProvider = ({ settings, children }) => {
  const [configFile, setConfigFile] = useState(settings)

  return (
    <ConfigFileContext.Provider value={[configFile, setConfigFile]}>
      {children}
    </ConfigFileContext.Provider>
  )
}

// hook context

export function useConfigFile () {
  const ConfigFile = useContext(ConfigFileContext)
  return ConfigFile || [{}, () => {}]
}
