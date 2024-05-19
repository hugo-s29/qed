import { useEffect, useRef, useState } from 'react'
import ProofTreeNode from './proof-tree-node'
import { ISequent } from './types'
import { parseSequent } from './utils'
import styled from 'styled-components'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

const ProofTreeContainer = styled.div`
  min-width: 100vw;
  overflow: scroll;
  min-height: 50vh;
  display: block;
  align-items: center;
  justify-content: center;
  padding-left: 150px;
`

export function App() {
  const [seq, setSeq] = useState<ISequent | null>(null)
  const { width, height } = useWindowSize()
  const tree = useRef<{ isValid: () => boolean }>(null)
  const [valid, setValid] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (tree.current) {
        const n = tree.current.isValid()
        if(n != valid) setValid(n)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <input
        className="seq-input"
        onChange={(e) => setSeq(parseSequent(e.target.value))}
        placeholder="Séquent"
      />
      <br />
      <ProofTreeContainer>
        {seq != null && (
          <>
            <ProofTreeNode ref={tree} sequent={seq} first />
            {valid && (
              <Confetti width={width} height={height} numberOfPieces={30} />
            )}
          </>
        )}
      </ProofTreeContainer>
    </>
  )
}

export default App
