import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export type QuestionCommentProps = {
	authorId: UniqueEntityID;
	questionId: UniqueEntityID;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
};

export class QuestionComment extends Entity<QuestionCommentProps> {
	static create(
		props: Optional<QuestionCommentProps, "createdAt">,
		id?: UniqueEntityID,
	) {
		const questionComment = new QuestionComment(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);
		return questionComment;
	}

	get content() {
		return this.props.content;
	}

	get questionId() {
		return this.props.questionId;
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
