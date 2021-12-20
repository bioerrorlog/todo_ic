import Debug "mo:base/Debug";

module Types {

    public type Task = {
        id: Nat;
        completed: Bool;
        description: Text; // TODO: extend TaskText
    };

    public type TaskText = {
        description: Text;
    };
};
