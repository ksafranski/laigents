function quicksort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left: number[] = [];
  const right: number[] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quicksort(left), pivot, ...quicksort(right)];
}

// Example usage:
const unsortedArray = [3, 6, 8, 10, 1, 2, 1];
const sortedArray = quicksort(unsortedArray);
console.log(sortedArray); // [1, 1, 2, 3, 6, 8, 10]
