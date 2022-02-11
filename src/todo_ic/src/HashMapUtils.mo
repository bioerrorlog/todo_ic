import HashMap "mo:base/HashMap";

module {

  public func getWithInitVal<K, V>(hashMap:HashMap.HashMap<K, V>, key:K, initVal:V) : V {
    switch(hashMap.get(key)){
      case null {initVal};
      case (? v) {v};
    }
  };
};
