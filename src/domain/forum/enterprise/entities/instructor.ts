import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface InstructorProps {
	name: string;
}

export class Instructor extends Entity<InstructorProps> {
	static create(props: InstructorProps, id?: UniqueEntityID) {
		const instructor = new Instructor(
			{
				...props,
			},
			id,
		);
		return instructor;
	}
}
