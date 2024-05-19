%{
open Ast
%}

%token <string> ID
%token TOP
%token BOT
%token NOT
%token LPARENS
%token RPARENS
%token AND
%token OR
%token TACK
%token EXISTS
%token FORALL
%token COMMA
%token SEMICOLON
%token IMP
%token EOF

%nonassoc NOT
%nonassoc AND
%nonassoc OR
%nonassoc COMMA
%nonassoc IMP

%start <Ast.formula> formula_prog
%start <Ast.sequent> sequent_prog
%start <Ast.term> term_prog

%%

formula_prog:
	| e = formula; EOF { e }
	;

sequent_prog:
	| e = sequent; EOF { e }
	;

term_prog:
	| e = term; EOF { e }
	;

sequent:
	| hyp = formulas; TACK; goal = formula { Sequent(hyp, goal) }
	;

term:
	| x = ID { Var x }
	| f = ID; LPARENS; t = terms; RPARENS { Fun(f, t) }
	;

terms:
	| { [] }
	| t=term { [t] }
	| t=term; COMMA; tl=terms { t::tl }
	;
	
formula:
	| TOP { Top }
	| BOT { Bot }
	| x = ID; LPARENS; t = terms; RPARENS { Pred(x, t) }
	| x = ID { Pred(x, []) }
	| FORALL; x = ID; COMMA; f = formula { Forall(x, f) }
	| EXISTS; x = ID; COMMA; f = formula { Exists(x, f) }
	| NOT; f = formula { Not f }
	| f = formula; AND; g = formula { And(f, g) }
	| f = formula; OR ; g = formula { Or (f, g) }
	| f = formula; IMP; g = formula { Imp(f, g) }
	| LPARENS; f = formula; RPARENS { f }
	;

formulas:
	| { [] }
	| f = formula { [f] }
	| f = formula; SEMICOLON; fl = formulas { f::fl }
	;
