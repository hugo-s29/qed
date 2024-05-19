export type ITerm = string | {
	symbol: string;
	contents: ITerm[]
}

export type IFormula =
	{ type: "Pred"; symbol: string; contents: ITerm[] }
| { type: "Top" }
| { type: "Bottom" }
| { type: "And"; left: IFormula; right: IFormula }
| { type: "Or"; left: IFormula; right: IFormula }
| { type: "Imp"; left: IFormula; right: IFormula }
| { type: "Equiv"; left: IFormula; right: IFormula }
| { type: "Not"; content: IFormula }
| { type: "Forall"; var: string; content: IFormula }
| { type: "Exists"; var: string; content: IFormula }

export interface ISequent {
	hypotheses: IFormula[];
	goal: IFormula
}

export type IProofTree =
  { type: "Incomplete"; sequent: ISequent }
| { type: "Rule"; sequent: ISequent; rule: string; subtrees: IProofTree[] }

export type IRule =
 	'axiom'
| 'bot_e'
| 'top_i'
| 'not_i'
| 'not_e'
| 'imp_i'
| 'imp_e'
| 'and_i'
| 'and_eg'
| 'and_ed'
| 'or_ig'
| 'or_id'
| 'or_e'
| 'forall_i'
| 'forall_e'
| 'exists_i'
| 'exists_e'
| 'lem'
| 'raa'
| 'not_not_e'
