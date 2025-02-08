# QuickSort Implementation in TypeScript

## Overview

This document provides a detailed description of the QuickSort algorithm implemented in TypeScript. QuickSort is a popular sorting algorithm known for its efficiency and recursive divide-and-conquer approach.

## Functions

### `quicksort<T>(array: T[], low: number = 0, high: number = array.length - 1): T[]`

The `quicksort` function sorts an array of elements in-place using the QuickSort algorithm.

#### Parameters

- `array: T[]`: The array to be sorted, where `T` represents a generic type.
- `low: number` (optional): The starting index of the array subset to be sorted. Default value is `0`.
- `high: number` (optional): The ending index of the array subset to be sorted. Default value is `array.length - 1`.

#### Returns

- `T[]`: The sorted array.

#### Description

The `quicksort` function recursively sorts elements in the array by selecting a pivot and partitioning the elements into two subarrays, one with elements less than or equal to the pivot and the other with elements greater than the pivot. It then recursively sorts the subarrays.

#### Example Usage

```typescript
const sortedArray = quicksort([10, 7, 8, 9, 1, 5]);
console.log(sortedArray); // Output: [1, 5, 7, 8, 9, 10]
```

### `partition<T>(array: T[], low: number, high: number): number`

The `partition` function rearranges elements in the array such that elements less than or equal to the pivot are on the left, and elements greater than the pivot are on the right.

#### Parameters

- `array: T[]`: The array containing elements to be partitioned.
- `low: number`: The starting index of the subset to be partitioned.
- `high: number`: The ending index (inclusive) of the subset to be partitioned.

#### Returns

- `number`: The index position of the pivot element after partitioning.

#### Description

The `partition` function selects the last element in the subset as the pivot. It then iterates over the subset, swapping elements to ensure that all elements less than or equal to the pivot are on the left. Finally, it places the pivot in its correct sorted position and returns its index.

## Summary

This implementation of QuickSort is efficient and operates in-place, using O(log n) additional space due to recursion. The partitioning step ensures that the pivot is in its correct position in each recursive call, while subarrays are independently sorted. This makes QuickSort a highly efficient sorting algorithm for average and typical use cases.