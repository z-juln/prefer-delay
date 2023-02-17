# prefer-delay

prefer delay

## install

`npm i prefer-delay`

## use

### promiseDelay

```typescript
const { promiseDelay } = require('prefer-delay');

console.log('start\t', Date.now());
const print = (index: number) => console.log(index, '\t', Date.now());
const delayFn = promiseDelay(print, 1000);
delayFn(1); // expect time: 0
delayFn(2); // expect time: 1000
delayFn(3); // expect time: 2000
delayFn(4); // expect time: 3000
delayFn(5); // expect time: 4000
setTimeout(() => {
  delayFn(6); // expect time: 5000
}, 4500);
setTimeout(() => {
  delayFn(7); // expect time: 6500
}, 6500);
```

print:
```
start    1676624969053
1        1676624969056
2        1676624970055
3        1676624971054
4        1676624972055
5        1676624973055
6        1676624974055
7        1676624975558
```

### delay

```typescript
const { delay } = require('prefer-delay');

(async () => {
  console.log('start\t', Date.now()); // analytic time: 0
  await delay(1000);
  console.log('end\t', Date.now()); // analytic time: 1000
})();
```

print:
```
start    1676620421976
end      1676620422979
```
