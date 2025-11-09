import React from "react"
import { Block } from "baseui/block"
import { useEditor } from "@layerhub-io/react"
import InnerHTML from 'dangerously-set-html-content'
import previewAMPhtml from '@lib/previewAMPhtml';
import useDesignEditorContext from "../../../../hooks/useDesignEditorContext"

const Graphic = () => {
  const editor = useEditor()
  const { scenes } = useDesignEditorContext()
  const [loading, setLoading] = React.useState(true)
  const [state, setState] = React.useState('')
  const makePreview = React.useCallback(async () => {
    if (editor) {
      const promises = scenes.map(async (scene) => (await editor.renderer.render(scene)) as string);
      const images = await Promise.all(promises);
      const previewAMP = previewAMPhtml(images)
      setState(previewAMP)
      setLoading(false)
    }
  }, [editor, scenes])

  React.useEffect(() => {
    makePreview()
  }, [editor])

  return (
    <Block>
      {!loading && <InnerHTML html={state} />}
    </Block>
  )
}

export default Graphic
