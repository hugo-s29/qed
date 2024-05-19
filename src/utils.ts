import { styleText } from './math_style'
import { IFormula, IRule, ISequent, ITerm } from './types'

export function termToString(t: ITerm): string {
  if (typeof t == 'string') return t
  else if (t.contents.length == 0) return `${styleText(t.symbol)}`
  else
    return `${styleText(t.symbol)}(${t.contents.map(termToString).join(',')})`
}

export function formulaToString(f: IFormula): string {
  switch (f.type) {
    case 'Pred':
      if (f.contents.length == 0) return `${styleText(f.symbol)}`
      else
        return `${styleText(f.symbol)}(${f.contents
          .map(termToString)
          .join(',')})`
    case 'Top':
      return '⊤'
    case 'Bottom':
      return '⊥'
    case 'And':
      return `(${formulaToString(f.left)} ∧ ${formulaToString(f.right)})`
    case 'Or':
      return `(${formulaToString(f.left)} ∨ ${formulaToString(f.right)})`
    case 'Imp':
      return `(${formulaToString(f.left)} → ${formulaToString(f.right)})`
    case 'Equiv':
      return `(${formulaToString(f.left)} ↔ ${formulaToString(f.right)})`
    case 'Not':
      return `¬${formulaToString(f.content)}`
    case 'Forall':
      return `∀${styleText(f.var)}, ${formulaToString(f.content)}`
    case 'Exists':
      return `∃${styleText(f.var)}, ${formulaToString(f.content)}`
  }
}

export function sequentToString(s: ISequent): string {
  const hyps = s.hypotheses.map(formulaToString).join(' ; ')
  const goal = formulaToString(s.goal)
  return `${hyps} ⊢ ${goal}`
}

export function ruleToString(r: IRule): string {
  switch (r) {
    case 'axiom':
      return 'Ax'
    case 'bot_e':
      return '⊥'
    case 'top_i':
      return '⊤'
    case 'not_i':
      return '¬i'
    case 'not_e':
      return '¬e'
    case 'imp_i':
      return '→i'
    case 'imp_e':
      return '→e'
    case 'and_i':
      return '∧i'
    case 'and_eg':
      return '∧e,g'
    case 'and_ed':
      return '∧ed'
    case 'or_ig':
      return '∨i,g'
    case 'or_id':
      return '∨i,d'
    case 'or_e':
      return '∨e'
    case 'forall_i':
      return '∀i'
    case 'forall_e':
      return '∀e'
    case 'exists_i':
      return '∃e'
    case 'exists_e':
      return '∃i'
    case 'lem':
      return 'TE'
    case 'raa':
      return 'Abs'
    case 'not_not_e':
      return '¬¬e'
  }
}

export function isEqual(obj1: any, obj2: any): boolean {
  var props1 = Object.getOwnPropertyNames(obj1)
  var props2 = Object.getOwnPropertyNames(obj2)
  if (props1.length != props2.length) {
    return false
  }
  for (var i = 0; i < props1.length; i++) {
    let val1 = obj1[props1[i]]
    let val2 = obj2[props1[i]]
    let isObjects = isObject(val1) && isObject(val2)
    if ((isObjects && !isEqual(val1, val2)) || (!isObjects && val1 !== val2))
      return false
  }
  return true
}
function isObject(object: any): object is Object {
  return object != null && typeof object === 'object'
}

export function isIn<T>(x: T, l: T[]): boolean {
  return l.filter((y) => isEqual(x, y)).length > 0
}

export function parseFormula(x: string): IFormula | null {
  try {
    //@ts-ignore
    return JSON.parse(window.parseFormula(x));
  } catch {
    return null;
  }
}

export function parseSequent(x: string): ISequent | null {
  try {
    //@ts-ignore
    return JSON.parse(window.parseSequent(x));
  } catch {
    return null;
  }
}

export function parseTerm(x: string): ITerm | null {
  try {
    //@ts-ignore
    return JSON.parse(window.parseTerm(x));
  } catch {
    return null;
  }
}
