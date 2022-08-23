import api from "./lib/libFoo.mjs";
import { findOdds } from "./lib/libFoo.mjs";

let odds = findOdds([2, 4, 24, 33, 5, 66, 24]);
console.log("Odd numbers: ", odds);

odds = api.findOdds([12, 43, 22, 39, 52, 21]);
console.log("Odd numbers: ", odds);

// Outputting Hello World
console.log("Hello World");

// Simple data-munging
let studentData = [
  { name: "Bob", id: 0, scores: [68, 75, 76, 81] },
  { name: "Alice", id: 1, scores: [75, 90, 64, 88] },
  { name: "Carol", id: 2, scores: [59, 74, 71, 68] },
  { name: "Dan", id: 3, scores: [64, 58, 53, 62] },
];

function processStudentData(data, passThreshold = 60, meritThreshold = 75) {
  // C
  data.forEach(function (sdata) {
    let av =
      sdata.scores.reduce(function (prev, current) {
        return prev + current;
      }, 0) / sdata.scores.length;
    if (av > meritThreshold) {
      sdata.assessment = "passed with merit";
    } else if (av > passThreshold) {
      sdata.assessment = "passed";
    } else {
      sdata.assessment = "failed";
    }
    // D
    console.log(
      sdata.name +
        "'s (id: " +
        sdata.id +
        ") final assessment is: " +
        sdata.assessment.toUpperCase()
    );
    sdata.average = av;
  });
}

processStudentData(studentData);

// Iterating: for loops and Functional alternatives
for (let i in ["a", "b", "c"]) {
  console.log(i);
}
// outputs 1, 2, 3

let obj = { a: 3, b: 2, c: 4 };
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}

// Enumerating a list
let names = ["Alice", "Bob", "Carol"];
names.forEach(function (n, i) {
  console.log(i + ": " + n);
});

// Underscore
import _ from "./lib/underscore.min.mjs";

let items = ["F", "C", "C", "A", "B", "A", "C", "E", "F"];
let count = _.countBy(items);
console.log("Count: ", count);

let journeys = [
  { period: "morning", times: [44, 34, 56, 31] },
  { period: "evening", times: [35, 33] },
  { period: "morning", times: [33, 29, 35, 41] },
  { period: "evening", times: [24, 45, 27] },
  { period: "morning", times: [18, 23, 28] },
];
let groups = _.groupBy(journeys, "period");
let mTimes = _.pluck(groups["morning"], "times");
mTimes = _.flatten(mTimes);
let average = function (l) {
  let sum = _.reduce(
    l,
    function (a, b) {
      return a + b;
    },
    0
  );
  return sum / l.length;
};
console.log("Average morning time is " + average(mTimes));

// Functional Array Methods
let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let sum = nums
  .filter(function (o) {
    return o % 2;
  })
  .map(function (o) {
    return o * o;
  })
  .reduce(function (total, current) {
    return total + current;
  });

console.log("Sum of the odd squares is " + sum);

// Javascript Closures
function Counter(inc) {
  let count = 0;
  let add = function () {
    count += inc;
    console.log("Current count: " + count);
  };
  return add;
}
let inc2 = Counter(2);
inc2();
inc2();

function Counter2(inc) {
  let count = 0;
  let api = {};
  api.add = function () {
    count += inc;
    console.log("Current count: " + count);
  };
  api.sub = function () {
    count -= inc;
    console.log("Current count: " + count);
  };
  api.reset = function () {
    count = 0;
    console.log("Count reset to 0");
  };

  return api;
}

let cntr = Counter2(3);
cntr.add(); // Current count: 3
cntr.add(); // Current count: 6
cntr.sub(); // Current count: 3
cntr.reset(); // Count reset to 0
