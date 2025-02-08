# QuickSort Function Documentation

The `quicksort` function is an implementation of the QuickSort algorithm in TypeScript, which sorts an array of numbers. QuickSort is a recursive, divide-and-conquer sorting algorithm that is efficient and commonly used.

## Function Signature

```typescript
function quicksort(arr: number[]): number[];
```

## Parameters

- `arr: number[]`: An array of numbers that you want to sort.

## Returns

- `number[]`: A new array of numbers sorted in ascending order.

## Description

The `quicksort` function sorts the input array `arr` using the QuickSort algorithm. The algorithm involves selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then recursively sorted.

### Algorithm Steps

1. **Base Case**: If the length of the array `arr` is 0 or 1, return the array as it is already sorted.

2. **Choosing a Pivot**: Select the last element of the array as the pivot.

3. **Partitioning**: 
   - Initialize two empty arrays: `left` and `right`.
   - Iterate through the array (excluding the pivot):
     - If the element is less than the pivot, add it to the `left` array.
     - Otherwise, add it to the `right` array.

4. **Recursive Sorting**: Recursively apply `quicksort` to the `left` and `right` arrays, and concatenate the sorted left array, the pivot, and the sorted right array.

## Example Usage

Here's an example of how to use the `quicksort` function:

```typescript
const unsortedArray = [3, 6, 8, 10, 1, 2, 1];
const sortedArray = quicksort(unsortedArray);
console.log(sortedArray); // Output: [1, 1, 2, 3, 6, 8, 10]
```

### Explanation

- The input array `[3, 6, 8, 10, 1, 2, 1]` is passed to the `quicksort` function.
- The function sorts the array and returns a new array `[1, 1, 2, 3, 6, 8, 10]`.
- The original array remains unchanged, demonstrating that the QuickSort function returns a new sorted array.

## Note

- The QuickSort algorithm is efficient with a time complexity of `O(n log n)` on average. However, it may degrade to `O(n^2)` in the worst case, which can occur with an unbalanced partition.
- This implementation is not in-place; it produces a new array and uses additional space, unlike typical in-place quicksort implementations.