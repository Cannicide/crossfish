import { Collection } from "djs.14";

export class CrossfishCollection<K, V> extends Collection<K, V> {
    constructor(iterable?: Iterable<readonly [K, V]> | null | undefined) {
        super(iterable);
    }

    toArray() {
        return [...this.values()];
    }

    top(amount: number) {
        return new CrossfishCollection<K, V>([...this.entries()].filter((_, i) => i < amount));
    }

    bottom(amount: number) {
        return new CrossfishCollection<K, V>([...this.entries()].filter((_, i) => i > this.size - 1 - amount));
    }

    static ofLength(length: number) {
        return new this(new Array(length).fill(null).map((_, i) => [i, undefined]));
    }

    static generate(length: number, generator: (key: number, collection?: CrossfishCollection<number, any>) => CrossfishCollection<Number, any>) {
        return this.ofLength(length).map((_, i, self) => generator(i, self));
    }
};