function quicksort<T>(array: T[], low: number = 0, high: number = array.length - 1): T[] {
    if (low < high) {
        const pivotIndex = partition(array, low, high);
        quicksort(array, low, pivotIndex - 1);
        quicksort(array, pivotIndex + 1, high);
    }
    return array;
}

function partition<T>(array: T[], low: number, high: number): number {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (array[j] <= pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
}

// Example usage:
// const sortedArray = quicksort([10, 7, 8, 9, 1, 5]);
// console.log(sortedArray); // Output: [1, 5, 7, 8, 9, 10]