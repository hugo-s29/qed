{
  open Parser
}

let white = [' ' '\t' '\n']+
let letter = ['a'-'z' 'A'-'Z']
let var = letter+

rule read = 
  parse
  | white { read lexbuf }
  | "⊤" | "T" | "true" | "top" { TOP }
  | "⊥" | "_|_" | "false" | "bottom" | "bot" { BOT }
  | "not" | "~" | "¬" { NOT }
  | "(" { LPARENS }
  | ")" { RPARENS }
  | "/\\" | "and" | "∧" { AND }
  | "\\/" | "or" | "∨" { OR }
  | "|-" | "⊢" { TACK }
  | "-]" | "exists" | "∃" { EXISTS }
  | "\\-/" | "forall" | "∀" { FORALL }
  | "," { COMMA }
  | ";" { SEMICOLON }
  | "->" | "=>" | "→" { IMP }
  | var { ID (Lexing.lexeme lexbuf) }
  | eof { EOF }
