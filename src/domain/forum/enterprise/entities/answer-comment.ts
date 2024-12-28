import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export type AnswerCommentProps = {
	authorId: UniqueEntityID;
	answerId: UniqueEntityID;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
};

export class AnswerComment extends Entity<AnswerCommentProps> {
	static create(
		props: Optional<AnswerCommentProps, "createdAt">,
		id?: UniqueEntityID,
	) {
		const answerComment = new AnswerComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return answerComment;
	}

	get content() {
		return this.props.content;
	}

	get answerId() {
		return this.props.answerId;
	}

	get authorId() {
		return this.props.authorId;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set content(content: string) {
		this.props.content = content;
		this.touch();
	}
}
