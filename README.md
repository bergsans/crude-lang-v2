![](crudelang-logo.png)


# Setup
```
npm install
npm run build
```

# REPL
```
./repl

> 3 + 3;
6
> 2 + 2 == 5;
false
> "Hello, " + "World!";
Hello, World!
> let name = "Tux";
undefined
> name;
Tux
> map(inc, [1, 2, 3]);
[ 2, 3, 4 ]
> foldl(add, 0, [1, 2, 3, 4, 5]);
15
> filter(isOdd, [1, 2, 3, 4, 5]);
[ 1, 3, 5 ]
> define appendBang(str) { return str + "!"; }
undefined
> appendBang("Hi");
Hi!
```

# Examples
```
./crude examples/fibonacci.cr
./crude examples/factorial.cr
./crude examples/bubble-sort.cr
```

# Quirks

Currently, the order of precedence forces user to parenthesize
comparisions, if used in conjunction with logical operators.

```
let n = 2;
if((n == 1) || (n == 2)) { ... }
```

For-loops require knowledge on how the language works under the hood,
and are not intuitive. Recursion is advised when not working on say simple
lists. See `./tests/evaluate.spec.ts` for examples.

# TODO's
* make generic parseGroupedExpression

* fix types - inspiration: https://github.com/estree/estree/blob/master/es5.md

* fix quirks
