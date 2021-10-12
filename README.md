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
```

# Quirks

Currently, the order of precedence forces user to parenthesize
comparisions, if used in conjunction with logical operators.

```
let n = 2;
if((n == 1) || (n == 2)) { ... }
```

Cannot use `concat(arr, arrTwo)` in foldl as list argument. Instead, use
a let declaration assignment beforehand,

```
let arr = [1, 2];
let arrTwo = [3, 4];
let concatenated = concat(arr, arrTwo);
foldl(add, 0, concatenated);
```


