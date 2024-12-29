import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

interface CommentOnAnswerUseCaseResponse {
	answerComment: AnswerComment;
}

export class CommentOnAnswerUseCase {
	constructor(
		private answerCommentsRepository: AnswerCommentsRepository,
		private answersRepository: AnswersRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error("Answer not found.");
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityID(authorId),
			answerId: answer.id,
			content,
		});

		await this.answerCommentsRepository.create(answerComment);

		return {
			answerComment,
		};
	}
}
