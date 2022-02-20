import Buffer "mo:base/Buffer";

module {

  /// Append array via Buffer
  /// (motoko-base Array.append is depricated)
  public func append<A>(xs : [A], ys : [A]) : [A] {
    switch(xs.size(), ys.size()) {
      case (0, 0) { []; };
      case (0, _) { ys; };
      case (_, 0) { xs; };
      case (xsSize, ysSize) {
        let buffer : Buffer.Buffer<A> = Buffer.Buffer(xs.size() + ys.size());
        for (x in xs.vals()) {
          buffer.add(x);
        };
        for (y in ys.vals()) {
          buffer.add(y);
        };
        buffer.toArray();
      };
    };
  };
};
