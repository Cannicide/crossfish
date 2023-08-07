export class Structure<T> {

    original?: T;
    /**
     * @internal
     * @private
     */
    _original: T|Promise<T>;

    constructor(original: T|Promise<T>) {
        this._original = original;
    }

    /**
     * @internal
     * @private
     */
    async init() {
        this.original = await Promise.resolve(this._original);
        return this;
    }

    /**
     * @internal
     * @private
     */
    async wrapper<K>(callback: (o: T) => K|Promise<K>) : Promise<K> {
        await this.init();
        return await callback(this.original as T);
    }

}