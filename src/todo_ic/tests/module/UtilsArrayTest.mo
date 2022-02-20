import Debug "mo:base/Debug";

import UA "../../src/Utils/Array";

Debug.print("Module Test: Utils/Array");

do {
  Debug.print("  append: size 0 to size 0");

  let arrrayX = [];
  let arrrayY = [];

  let result = UA.append(arrrayX, arrrayY);
  assert(result == []);
};

do {
  Debug.print("  append: size 0 to size >0");

  let arrrayX = [];
  let arrrayY = ["aaa", "bbb"];

  let result = UA.append(arrrayX, arrrayY);
  assert(result == ["aaa", "bbb"]);
};

do {
  Debug.print("  append: size >0 to size 0");

  let arrrayX = ["1111", "2222"];
  let arrrayY = [];

  let result = UA.append(arrrayX, arrrayY);
  assert(result == ["1111", "2222"]);
};

do {
  Debug.print("  append: size >0 to size >0");

  let arrrayX = ["1111", "2222"];
  let arrrayY = ["aaa", "bbb"];

  let result = UA.append(arrrayX, arrrayY);
  assert(result == ["1111", "2222", "aaa", "bbb"]);
};
