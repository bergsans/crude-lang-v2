![](./crudelang-logo.png)

CrudeLang is a learning project aiming to increase my knowledge of parsers and interpreters. I've previously implemented [a minimalistic Lisp](https://github.com/bergsans/one-page-lisp); therefore I thought it would be challenging to make an imperative interpreter.
[masak](https://github.com/masak) volunteered to make a [specification for CrudeLang](https://masak.github.io/crude-spec/).

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
./crude examples/fibonacci.crude
./crude examples/factorial.crude
./crude examples/bubble-sort.crude
./crude examples/selection-sort.crude
```

## Game of Life implementation
```
./crude examples/game-of-life.crude
```
![](./examples/game-of-life-screenshot.gif)
