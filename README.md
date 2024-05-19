# QED.

QED is a web-based proof tree editor. It checks the rules you applied at each step of your tree and makes sure your proof is correct.
After that, you can enjoy the confettis.

An user-manual is available on the [webpage](http://167.99.84.84/soutien/qed/) (in French).

The formula parser is written in OCaml (with Menhir), and integrated in the project with `js_of_ocaml`.
The rest of the project is written in Typescript, with React as the layout library.

## How to run this project.

Fist, install the dependencies and compile the Vite project with:

```bash
npm install
npm run build

# or

yarn
yarn build
```

Once this project is fully built, host the files on a server and you are good to go!

## Rebuilding the parser.

The parser file is included in the project, but you may want to rebuild it yourself.
You just need to run a `dune build` in the `parser/` directory.
Then, just move the generated JS parser file in the same directory as rest of the project.

## Motivation for this project.

This project was part of the [tutoring work](http://167.99.84.84/soutien/) I do at Clemenceau High School (Nantes, France).
It was made as a tool for students to learn about proof trees and natural deduction (classical and intuitionist).

**Be careful:** solving proof trees can be very addictive (thanks to the confetti). 
