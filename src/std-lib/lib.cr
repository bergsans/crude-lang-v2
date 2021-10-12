define id(x) {
  return x;
}

define add(a, b) {
  return a + b;
}

define isOdd(x) {
  return x % 2 != 0;
}

define isEven(x) {
  return x % 2 == 0;
}

define inc(x) {
  return x + 1;
}

define filter(predicate, li) {
  define loop(list, i) {
    if(i < length(li)) {
      if(predicate(li[i])) {
        return loop(concat(list, li[i]), i + 1);
      }
      return loop(list, i + 1);
    }
    return list;
  }
  return loop([], 0);
}

define map(fn, li) {
  define loop(list, i) {
    if(i < length(li)) {
      return loop(concat(list, fn(li[i])), i + 1);
    }
    return list;
  }
  return loop([], 0);
}

define every(predicate, li) {
  define loop(i) {
    if(i < length(li)) {
      if(predicate(li[i]) == false) {
        return false;
      }
      return loop(i + 1);
    }
    return true;
  }
  return loop(0);
}

define some(predicate, li) {
  define loop(i) {
    if(i < length(li)) {
      if(predicate(li[i]) == true) {
        return true;
      }
      return loop(i + 1);
    }
    return false;
  }
  return loop(0);
}

define foldl(fn, curr, li) {
  define loop(i, currentValue) {
    if(i < length(li)) {
      return loop(i + 1, fn(currentValue, li[i]));
    }
    return currentValue;
  }
  return loop(0, curr);
}

define trimStart(s) {
  define count(n) {
    if(slice(s, n, n + 1)!= " ") {
      let len = length(s);
      return slice(s, n, len);
    }
    return count(n + 1);
  }
  return count(0);
}

define setEl(i, val, arr) {
  let len = length(arr);
  let before = slice(arr, 0, i);
  let after = slice(arr, i + 1, len);
  let tempCut = concat(before, [val]);
  return concat(tempCut, after);
}
