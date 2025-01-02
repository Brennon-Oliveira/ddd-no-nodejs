import type { DomainEvent } from "@/core/event/domain-event";
import { Entity } from "./entity";
import { DomainEvents } from "@/core/event/domain-events";

export abstract class AggregateRoot<Props> extends Entity<Props> {
	private _domainEvents: DomainEvent[] = [];

	get domainEvents() {
		return this._domainEvents;
	}

	protected addDomainEvent(event: DomainEvent): void {
		this._domainEvents.push(event);
		DomainEvents.markedAggregateForDispatch(this);
	}

	public clearEvents() {
		this._domainEvents = [];
	}
}
