import { Injectable } from '@angular/core';

@Injectable()
// TODO: make this actually work as intended!
export class RestoreItemService<T> {
    original: T;
    current: T;

    setOriginal(item: T) {
        this.original = item;
        this.current = this.clone(item);
    }

    getCurrent(): T {
        return this.current;
    }

    setCurrent(value: T) {
        this.current = value;
    }

    getOriginal(): T {
        return this.original;
    }

    restoreOriginal(): T {
        this.current = this.clone(this.original);
        return this.getCurrent();
    }

    clone(item: T): T {
        // Super poor clone implementation
        if (!item) {
            return null;
        }
        return JSON.parse(JSON.stringify(item));
    }
}
