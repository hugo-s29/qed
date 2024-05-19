import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useState } from 'react'
import { IFormula, IRule, ISequent } from './types'
import { isEqual, isIn, parseFormula, sequentToString } from './utils'
import Select, { ActionMeta, SingleValue } from 'react-select'
import './style.css'

interface IRuleDict {
  value: IRule | null
  label: string
}

const rules: IRuleDict[] = [
  { value: null, label: '' },
  { value: 'axiom', label: 'Ax' },
  { value: 'bot_e', label: '⊥e' },
  { value: 'top_i', label: '⊤i' },
  { value: 'not_i', label: '¬i' },
  { value: 'not_e', label: '¬e' },
  { value: 'imp_i', label: '→i' },
  { value: 'imp_e', label: '→e' },
  { value: 'and_i', label: '∧i' },
  { value: 'and_eg', label: '∧e,g' },
  { value: 'and_ed', label: '∧e,d' },
  { value: 'or_ig', label: '∨i,g' },
  { value: 'or_id', label: '∨i,d' },
  { value: 'or_e', label: '∨e' },
  { value: 'forall_i', label: '∀i' },
  { value: 'forall_e', label: '∀e' },
  { value: 'exists_e', label: '∃e' },
  { value: 'exists_i', label: '∃i' },
  { value: 'lem', label: 'TE' },
  { value: 'raa', label: 'Abs' },
  { value: 'not_not_e', label: '¬¬e' },
]

export const hasNoChild: (IRule | null)[] = ['lem', 'axiom', null, 'top_i']

export const ProofTreeNode = forwardRef(function (
  {
    sequent,
    first = false
  }: {
    sequent: ISequent
    first?: boolean
  },
  ref,
) {
  const seq = <span className="math">{sequentToString(sequent)}</span>

  const [rule, setRule] = useState<IRule | null>(null)

  function onChange(val: SingleValue<IRuleDict>, _: ActionMeta<IRuleDict>) {
    if (val) setRule(val.value)
  }

  return (
    <div className={first ? "proof-first proof" : "proof"}>
      <div className="prems">
        <RuleComponents rule={rule} sequent={sequent} ref={ref as any} />
        <div className="rulename">
          <Select
            options={rules}
            onChange={onChange}
            styles={{
              container: (baseStyles) => ({
                ...baseStyles,
                width: '9em',
                margin: '0.5em',
                fontSize: '1em',
                height: '2em',
                minHeight: '2em',
              }),
              control: (baseStyles) => ({
                ...baseStyles,
                height: '2em',
                minHeight: '2em',
              }),
              valueContainer: (baseStyles) => ({
                ...baseStyles,
                height: '2em',
                minHeight: '2em',
                display: 'flex',
              }),
              indicatorsContainer: (baseStyles) => ({
                ...baseStyles,
                height: '2em',
                minHeight: '2em',
                display: 'flex',
              }),
            }}
          />
        </div>
      </div>
      <div className="concl">
        <div className="concl-left" />
        <div className="concl-center">{seq}</div>
        <div className="concl-right" />
      </div>
    </div>
  )
})

function MinimalProofComponent({ children }: any) {
  return (
    <div className="proof">
      <div className="concl">
        <div className="concl-left" />
        <div className="concl-center">{children}</div>
        <div className="concl-right" />
      </div>
    </div>
  )
}

const RuleComponents = forwardRef(function (
  {
    rule,
    sequent,
  }: {
    rule: IRule | null
    sequent: ISequent
  },
  ref,
) {
  const [hyp, setHyp] = useState<IFormula | null>(null)
  const [hyp1, setHyp1] = useState<IFormula | null>(null)
  const [hyp2, setHyp2] = useState<IFormula | null>(null)

  const ref1 = useRef<{ isValid: () => boolean }>(null)
  const ref2 = useRef<{ isValid: () => boolean }>(null)
  const ref3 = useRef<{ isValid: () => boolean }>(null)

  const makeValid = () => <>OK</>
  const makeInvalid = () => <>NO!</>

  const isValid = () => {
    switch (rule) {
      case 'axiom':
        return isIn(sequent.goal, sequent.hypotheses)
      case 'bot_e':
        return ref1.current?.isValid()
      case 'top_i':
        return sequent.goal.type == 'Top'
      case 'not_i':
        return sequent.goal.type == 'Not' && ref1.current?.isValid()
      case 'not_e':
        return (
          sequent.goal.type == 'Bottom' &&
          ref1.current?.isValid() &&
          ref2.current?.isValid()
        )
      case 'imp_i':
        return sequent.goal.type == 'Imp' && ref1.current?.isValid()
      case 'imp_e':
        return ref1.current?.isValid() && ref2.current?.isValid()
      case 'and_i':
        return (
          sequent.goal.type == 'And' &&
          ref1.current?.isValid() &&
          ref2.current?.isValid()
        )
      case 'and_eg':
        return ref1.current?.isValid()
      case 'and_ed':
        return ref1.current?.isValid()
      case 'or_ig':
        return sequent.goal.type == 'Or' && ref1.current?.isValid()
      case 'or_id':
        return sequent.goal.type == 'Or' && ref1.current?.isValid()
      case 'or_e':
        return (
          ref1.current?.isValid() &&
          ref2.current?.isValid() &&
          ref3.current?.isValid()
        )
      case 'lem':
        return (
          sequent.goal.type == 'Or' &&
          sequent.goal.right.type == 'Not' &&
          isEqual(sequent.goal.left, sequent.goal.right.content)
        )
      case 'raa':
        return ref1.current?.isValid()
      case 'not_not_e':
        return ref1.current?.isValid()

      case 'forall_i':
      case 'forall_e':
      case 'exists_i':
      case 'exists_e':
      case null:
        return undefined
    }
  }

  useImperativeHandle(ref, () => ({ isValid }))

  switch (rule) {
    case 'axiom': {
      if (!isIn(sequent.goal, sequent.hypotheses)) return makeInvalid()
      else return makeValid()
    }

    case 'bot_e': {
      return (
        <ProofTreeNode
          ref={ref1}
          sequent={{ ...sequent, goal: { type: 'Bottom' } }}
        />
      )
    }

    case 'top_i': {
      if (sequent.goal.type != 'Top') return makeInvalid()
      else return makeValid()
    }

    case 'not_i': {
      if (sequent.goal.type != 'Not') return makeInvalid()
      else
        return (
          <ProofTreeNode
            ref={ref1}
            sequent={{
              goal: { type: 'Bottom' },
              hypotheses: [...sequent.hypotheses, sequent.goal.content],
            }}
          />
        )
    }

    case 'not_e': {
      if (sequent.goal.type == 'Bottom')
        return (
          <>
            <MinimalProofComponent>
              <span className="math">
                <input onChange={(e) => setHyp(parseFormula(e.target.value))} />
              </span>
            </MinimalProofComponent>
            <div className="inter-proof" />
            {hyp != null && (
              <>
                <ProofTreeNode
                  ref={ref1}
                  sequent={{
                    goal: hyp,
                    hypotheses: [...sequent.hypotheses],
                  }}
                />
                <div className="inter-proof" />
                <ProofTreeNode
                  ref={ref2}
                  sequent={{
                    goal: { type: 'Not', content: hyp },
                    hypotheses: [...sequent.hypotheses],
                  }}
                />
              </>
            )}
          </>
        )
      else return makeInvalid()
    }

    case 'imp_i': {
      if (sequent.goal.type != 'Imp') return makeInvalid()
      else
        return (
          <ProofTreeNode
            ref={ref1}
            sequent={{
              goal: sequent.goal.right,
              hypotheses: [...sequent.hypotheses, sequent.goal.left],
            }}
          />
        )
    }

    case 'imp_e': {
      return (
        <>
          <MinimalProofComponent>
            <span className="math">
              <input onChange={(e) => setHyp(parseFormula(e.target.value))} />
            </span>
          </MinimalProofComponent>
          <div className="inter-proof" />
          {hyp != null && (
            <>
              <ProofTreeNode
                ref={ref1}
                sequent={{
                  goal: { type: 'Imp', left: hyp, right: sequent.goal },
                  hypotheses: [...sequent.hypotheses],
                }}
              />
              <div className="inter-proof" />
              <ProofTreeNode
                ref={ref2}
                sequent={{
                  goal: hyp,
                  hypotheses: [...sequent.hypotheses],
                }}
              />
            </>
          )}
        </>
      )
    }

    case 'and_i': {
      if (sequent.goal.type != 'And') return makeInvalid()
      else
        return (
          <>
            <ProofTreeNode
              ref={ref1}
              sequent={{
                goal: sequent.goal.left,
                hypotheses: [...sequent.hypotheses],
              }}
            />
            <div className="inter-proof" />
            <ProofTreeNode
              ref={ref2}
              sequent={{
                goal: sequent.goal.right,
                hypotheses: [...sequent.hypotheses],
              }}
            />
          </>
        )
    }

    case 'and_eg': {
      return (
        <>
          <MinimalProofComponent>
            <span className="math">
              <input onChange={(e) => setHyp(parseFormula(e.target.value))} />
            </span>
          </MinimalProofComponent>
          <div className="inter-proof" />
          {hyp != null && (
            <ProofTreeNode
              ref={ref1}
              sequent={{
                goal: { type: 'And', left: sequent.goal, right: hyp },
                hypotheses: [...sequent.hypotheses],
              }}
            />
          )}
        </>
      )
    }

    case 'and_ed': {
      return (
        <>
          <MinimalProofComponent>
            <span className="math">
              <input onChange={(e) => setHyp(parseFormula(e.target.value))} />
            </span>
          </MinimalProofComponent>
          <div className="inter-proof" />
          {hyp != null && (
            <ProofTreeNode
              ref={ref1}
              sequent={{
                goal: { type: 'And', left: hyp, right: sequent.goal },
                hypotheses: [...sequent.hypotheses],
              }}
            />
          )}
        </>
      )
    }

    case 'or_ig': {
      if (sequent.goal.type != 'Or') return makeInvalid()
      else
        return (
          <ProofTreeNode
            ref={ref1}
            sequent={{
              goal: sequent.goal.left,
              hypotheses: [...sequent.hypotheses],
            }}
          />
        )
    }

    case 'or_id': {
      if (sequent.goal.type != 'Or') return makeInvalid()
      else
        return (
          <ProofTreeNode
            ref={ref1}
            sequent={{
              goal: sequent.goal.right,
              hypotheses: [...sequent.hypotheses],
            }}
          />
        )
    }

    case 'or_e': {
      return (
        <>
          <MinimalProofComponent>
            <span className="math">
              <input onChange={(e) => setHyp1(parseFormula(e.target.value))} />
            </span>
          </MinimalProofComponent>
          <div className="inter-proof" />
          <MinimalProofComponent>
            <span className="math">
              <input onChange={(e) => setHyp2(parseFormula(e.target.value))} />
            </span>
          </MinimalProofComponent>
          <div className="inter-proof" />
          {hyp1 != null && hyp2 != null && (
            <>
              <ProofTreeNode
                ref={ref1}
                sequent={{
                  goal: { type: 'Or', left: hyp1, right: hyp2 },
                  hypotheses: [...sequent.hypotheses],
                }}
              />
              <div className="inter-proof" />
              <ProofTreeNode
                ref={ref2}
                sequent={{
                  goal: sequent.goal,
                  hypotheses: [hyp1, ...sequent.hypotheses],
                }}
              />
              <div className="inter-proof" />
              <ProofTreeNode
                ref={ref3}
                sequent={{
                  goal: sequent.goal,
                  hypotheses: [hyp2, ...sequent.hypotheses],
                }}
              />
            </>
          )}
        </>
      )
    }

    case 'lem': {
      if (sequent.goal.type != 'Or') return makeInvalid()
      else if (sequent.goal.right.type != 'Not') return makeInvalid()
      else if (!isEqual(sequent.goal.left, sequent.goal.right.content))
        return makeInvalid()
      else return makeValid()
    }

    case 'raa': {
      return (
        <ProofTreeNode
          ref={ref1}
          sequent={{
            goal: { type: 'Bottom' },
            hypotheses: [
              ...sequent.hypotheses,
              { type: 'Not', content: sequent.goal },
            ],
          }}
        />
      )
    }

    case 'not_not_e': {
      return (
        <ProofTreeNode
          ref={ref1}
          sequent={{
            goal: {
              type: 'Not',
              content: { type: 'Not', content: sequent.goal },
            },
            hypotheses: [...sequent.hypotheses],
          }}
        />
      )
    }

    case 'forall_i':
    case 'forall_e':
    case 'exists_i':
    case 'exists_e':
    case null:
      break
  }

  return <></>
})

export default ProofTreeNode
