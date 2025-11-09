import Graphic from "./Graphic"
import Presentation from "./Presentation"
import Video from "./Video"
import useEditorType from "../../../../hooks/useEditorType"
import React from "react"

const Footer = () => {
  const editorType = useEditorType()

  return <Graphic />
  // return {
  //   NONE: <></>,
  //   PRESENTATION: <Presentation />,
  //   VIDEO: <Video />,
  //   GRAPHIC: <Graphic />,
  // }[editorType]
}

export default Footer
