import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import dayjs from "dayjs";

export interface QuestionProps {
	authorId: UniqueEntityID;
	bestAnswerId?: UniqueEntityID;
	content: string;
	title: string;
	slug: Slug;
	createdAt: Date;
	updatedAt?: Date;
}

export class Question extends Entity<QuestionProps> {
	static create(
		props: Optional<QuestionProps, "createdAt" | "slug">,
		id?: UniqueEntityID,
	) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createSlugFromText(props.title),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return question;
	}

	get authorId() {
		return this.props.authorId;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	get content() {
		return this.props.content;
	}

	get title() {
		return this.props.title;
	}

	get slug() {
		return this.props.slug;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get isNew() {
		return dayjs().diff(this.createdAt, "days") <= 3;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}

	set title(title: string) {
		this.props.title = title;
		this.props.slug = Slug.createSlugFromText(title);
		this.touch();
	}

	set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
		this.props.bestAnswerId = bestAnswerId;
		this.touch();
	}
}
