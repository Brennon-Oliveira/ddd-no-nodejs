import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

interface CommentOnQuestionUseCaseResponse {
	questionComment: QuestionComment;
}

export class CommentOnQuestionUseCase {
	constructor(
		private questionCommentsRepository: QuestionCommentsRepository,
		private questionsRepository: QuestionsRepository,
	) {}

	async execute({
		authorId,
		questionId,
		content,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			throw new Error("Question not found.");
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityID(authorId),
			questionId: question.id,
			content,
		});

		await this.questionCommentsRepository.create(questionComment);

		return {
			questionComment,
		};
	}
}
