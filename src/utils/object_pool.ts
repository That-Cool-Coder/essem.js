export class ObjectPool<T> {
    ObjectClass: { new (): T };
    availiable: T[] = [];
    totalObjects = 0;

    constructor(ObjectClass: { new (): T }, count: number) {
        this.ObjectClass = ObjectClass;
        this.reserve(count);
    }

    acquire(): T {
        // check if pool is empty
        if (this.availiable.length === 0) {
            // expand by 20% or minimum 1
            const toExpand = Math.round(this.totalObjects * 1.2) + 1;
            this.reserve(toExpand);
        }

        const object = this.availiable.pop() as T;
        return object;
    }

    release(object: T): void {
        this.availiable.push(object);
    }

    reset(): void {
        const countToFillIn = this.totalObjects - this.availiable.length;
        for (let i = 0; i < countToFillIn; i++) {
            const object = new this.ObjectClass();
            this.availiable.push(object);
        }
    }

    reserve(count: number): void {
        for (let i = 0; i < count; i++) {
            const object = new this.ObjectClass();
            this.availiable.push(object);
        }

        this.totalObjects += count;
    }
}
