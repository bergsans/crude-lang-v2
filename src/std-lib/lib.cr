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

define filter(predicate, arr) {
  let filtArr = [];
  for(i, 0, length(arr)) {
    if(predicate(arr[i])) {
      return change(filtArr, length(filtArr), arr[i]);
    }
  }
  return filtArr;
}

define map(fn, arr) {
  let newArr = [];
  for(i, 0, length(arr)) {
    return change(newArr, i, fn(arr[i]));
  }
  return newArr;
}

define every(predicate, li) {
  for(i, 0, length(li)) {
    if(predicate(li[i]) == false) {
      return false;
    }
  }
  return true;
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

define sort(arr) {
  for(i, 0, length(arr)) {
    for(j, 0, length(arr)) {
      let prevVal = arr[j];
      let nextVal = arr[j + 1];
      if(prevVal > nextVal) {
        let arr = change(arr, j, nextVal);
        return change(arr, j + 1, prevVal);
      }
    }
  }
  return arr;
}
