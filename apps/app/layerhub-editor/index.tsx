import React from 'react';
import Provider from "./Provider"
import Container from "./Container"
import DesignEditor from "./views/DesignEditor"

export default function Editor() {
  return (
    <Provider>
      <Container>
        <DesignEditor />
      </Container>
    </Provider>
  )
}