import { Injectable } from '@angular/core';

@Injectable()
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

    restoreOriginal(): T {
        this.current = this.clone(this.original);
        return this.getCurrent();
    }

    clone(item: T): T {
        // Super poor clone implementation
        return JSON.parse(JSON.stringify(item));
    }
}