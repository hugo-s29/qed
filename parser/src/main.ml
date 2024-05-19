open Ast
open Js_of_ocaml

type json = Yojson.Basic.t

let parse_sequent (s : string): sequent =
  let lexbuf = Lexing.from_string s in
  let ast = Parser.sequent_prog Lexer.read lexbuf in
  ast

let parse_formula (s : string): formula =
  let lexbuf = Lexing.from_string s in
  let ast = Parser.formula_prog Lexer.read lexbuf in
  ast

let parse_term (s : string): term =
  let lexbuf = Lexing.from_string s in
  let ast = Parser.term_prog Lexer.read lexbuf in
  ast

let rec json_of_term = function
  | Var x -> `String x
  | Fun(x,tl) -> `Assoc [
      ("symbol", `String x);
      ("contents", `List (List.map json_of_term tl))
    ]

let rec json_of_formula = function
  | Top -> `Assoc [ ("type", `String "Top") ]
  | Bot -> `Assoc [ ("type", `String "Bottom") ]
  | Pred(f,tl) -> `Assoc [ ("type", `String "Pred"); ("symbol", `String f);
      ("contents", `List (List.map json_of_term tl)); ]
  | And(f,g) -> `Assoc [ ("type", `String "And"); ("left", json_of_formula f); ("right", json_of_formula g) ]
  | Imp(f,g) -> `Assoc [ ("type", `String "Imp"); ("left", json_of_formula f); ("right", json_of_formula g) ]
  | Or(f,g) -> `Assoc [ ("type", `String "Or"); ("left", json_of_formula f); ("right", json_of_formula g) ]
  | Not f -> `Assoc [ ("type", `String "Not"); ("content", json_of_formula f) ]
  | Exists(x,f) -> `Assoc [ ("type", `String "Exists"); ("content", json_of_formula f); ("var", `String x) ]
  | Forall(x,f) -> `Assoc [ ("type", `String "Forall"); ("content", json_of_formula f); ("var", `String x) ]

let json_of_sequent = function
  | Sequent (hyp, goal) -> `Assoc [
    ("hypotheses", `List (List.map json_of_formula hyp));
    ("goal", json_of_formula goal)
  ]

let make_js_parser (f: string -> 'a) (g: 'a -> json) (x: Js.js_string Js.t): Js.js_string Js.t =
  Js.to_string x |> f |> g |> Yojson.Basic.to_string |> Js.bytestring


let _ = Js.export_all 
  (object%js
    method parseSequent (x: Js.js_string Js.t): Js.js_string Js.t =
      make_js_parser parse_sequent json_of_sequent x

    method parseFormula (x: Js.js_string Js.t): Js.js_string Js.t =
      make_js_parser parse_formula json_of_formula x

    method parseTerm (x: Js.js_string Js.t): Js.js_string Js.t =
      make_js_parser parse_term json_of_term x
  end)


  (*
let map_concat ?(sep: string = ",") (f: 'a -> string) (l: 'a list): string =
  List.map f l
  |> List.fold_left (fun acc r ->
      if acc = "" then r
      else r ^ sep ^ acc
    ) ""

let rec string_of_term: term -> string = function
  | Var x -> x
  | Fun(f,tl) -> f ^ "(" ^ map_concat string_of_term tl ^ ")"

let rec string_of_formula: formula -> string = function
  | Top -> "⊤"
  | Bot -> "⊥"
  | Pred(f,tl) -> f ^ "(" ^ map_concat string_of_term tl ^ ")"
  | Forall(x, f) -> "(∀" ^ x ^ "," ^ (string_of_formula f) ^ ")"
  | Exists(x, f) -> "(∃" ^ x ^ "," ^ (string_of_formula f) ^ ")"
  | Not f -> "¬" ^ (string_of_formula f)
  | Imp(f,g) -> "(" ^ (string_of_formula f) ^ "→" ^ (string_of_formula g) ^ ")"
  | And(f,g) -> "(" ^ (string_of_formula f) ^ "∧" ^ (string_of_formula g) ^ ")"
  | Or(f,g) -> "(" ^ (string_of_formula f) ^ "∨" ^ (string_of_formula g) ^ ")"

let string_of_sequent (Sequent (hyp, goal): sequent): string =
  let hyp' = map_concat string_of_formula hyp ~sep:";" in
  hyp' ^ "⊢" ^ string_of_formula goal

let () = print_endline "Hello !"

let () = read_line ()
    |> parse
    |> string_of_sequent
    |> print_endline
*)
