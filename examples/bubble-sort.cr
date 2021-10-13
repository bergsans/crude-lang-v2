define bubbleSort(arr) {
  let len = length(arr);
  define outerLoop(i, a) {
    define innerLoop(j, b) {
      if(j < len) {
        let prevVal = id(b[j]);
        let nextVal = id(b[j + 1]);
        if(prevVal > nextVal) {
          let tempArr = change(b, j, nextVal);
          let nextArr = change(tempArr, j + 1, prevVal);
          return innerLoop(j + 1, nextArr);
        }
        return innerLoop(j + 1, b);
      }
      return outerLoop(i + 1, b);
    }
    if(i < len) {
      return innerLoop(0, a);
    }
    return a;
  }
  return outerLoop(0, arr);
}
bubbleSort([13, 21, 1, 34, 2, 1, 5, 3, 55, 0, 8]);
