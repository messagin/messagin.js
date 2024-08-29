# Store Class
pb @
The `Store` class is a versatile and efficient data structure designed to manage key-value pairs in TypeScript. It combines the advantages of a `Map` for efficient lookups and an array to maintain the order of keys. This makes the `Store` class ideal for scenarios where both quick access to values and preserving the order of insertion are important.

## Features

- **Efficient Storage**: Utilizes a `Map` for storing key-value pairs, ensuring fast lookups, insertions, and deletions.
- **Ordered Keys**: Maintains an array of keys to preserve the order of insertion, allowing you to iterate over keys in the order they were added.
- **Asynchronous Operations**: Provides built-in asynchronous methods to handle operations that return Promises, making it easier to work with asynchronous code.

## API

### Map Methods

- **has**
  - Checks if a key exists in the store.
- **set**
  - Adds or updates a key-value pair in the store.
- **get**
  - Retrieves the value associated with a key.
- **delete**
  - Removes a key-value pair from the store.
- **keys**
  - Returns an array of keys in the order they were inserted.
- **values**
  - Returns an array of values in the order they were inserted.

### Array Methods

- **map**
  - Applies a callback function to each key-value pair and returns a **new** `Store` with the results.
- **forEach**
- **filter**
- **sort**
- **find**
- **every**
- **some**
- **reverse**
  - Reverses the order of the `Store` in-place.

### Custom Methods
- **clone**
  - Returns a copy of the `Store`.
- **first**
- **last**

### Asynchronous Methods

- **async.map**
  - Applies an asynchronous callback function to each key-value pair and returns a **new** `Store` with the results.
- **async.forEach**
  - Applies an asynchronous callback function to each key-value pair in the store.

## Usage Example

```typescript
const store = new Store<number>();
store.set('a', 1);
store.set('b', 2);

// Synchronous methods
console.log(store.has('a')); // true
console.log(store.get('b')); // 2
store.delete('a');
console.log(store.keys()); // ['b']

// Asynchronous methods
const newStore = await store.async.map(async (value, key, store) => {
  return value * 2;
});
console.log(newStore.get('b')); // 4

await store.async.forEach(async (value, key, store) => {
  console.log(key, value);
});
// Output:
// 'b', 2
```

## Conclusion

The `Store` class is a powerful tool for managing ordered key-value pairs with both synchronous and asynchronous methods. Its efficient design and straightforward API make it suitable for a wide range of applications, from simple data storage to complex asynchronous processing.
