import { EventEmitter } from "node:events";
import { Model } from "sequelize";

export class BaseManager<M extends Model> extends EventEmitter {
    
    model: M;
    supportedEvents: string[] = [];

    constructor(model: M) {
        super();
        this.model = model;
        this.supportedEvents = this.supportedEvents.concat([ "update", "delete", "newListener", "removeListener" ]);
    }

    get() {
        return this.model.toJSON();
    }

    async update(data: { [key: string]: any }) {
        this.emit('update', this.model.toJSON(), data);

        await this.model.update(data);
    }

    async delete() {
        this.emit('delete', this.model.toJSON());

        await this.model.destroy();
    }

}