type term =
  | Var of string
  | Fun of string * term list

type formula =
  | Top | Bot
  | Pred of string * term list
  | Forall of string * formula
  | Exists of string * formula
  | Not of formula
  | Imp of formula * formula
  | And of formula * formula
  | Or  of formula * formula

type sequent = Sequent of formula list * formula

