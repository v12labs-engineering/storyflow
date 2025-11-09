import React, { useEffect } from "react"
import { Canvas as LayerhubCanvas, useEditor } from "@layerhub-io/react"
import Playback from "../Playback"
import useDesignEditorContext from "../../../../hooks/useDesignEditorContext"
import ContextMenu from "../ContextMenu"

const Canvas = () => {
  const { displayPlayback, currentDesign, setCurrentDesign } = useDesignEditorContext();
  const editor = useEditor()

  useEffect(() => {
    if (editor) {
      setCurrentDesign({
        ...currentDesign,
        frame: {
          width: parseInt("1080"),
          height: parseInt("1920"),
        },
      });

      editor.frame.resize({
        width: parseInt("1080"),
        height: parseInt("1920"),
      });
    }
  }, []);

  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      {displayPlayback && <Playback />}
      <ContextMenu />
      <LayerhubCanvas
        config={{
          background: "#f1f2f6",
          controlsPosition: {
            rotation: "TOP",
          },
          shadow: {
            blur: 2,
            color: "#bdc3c7",
            offsetX: 0,
            offsetY: 0,
          },
        }}
      />
    </div>
  )
}

export default Canvas
