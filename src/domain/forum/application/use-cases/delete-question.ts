import { left, right, type Either } from "@/core/either";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Question } from "@/domain/forum/enterprise/entities/question";

interface DeleteQuestionUseCaseRequest {
	questionId: string;
	authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{}
>;

export class DeleteQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}

	async execute({
		questionId,
		authorId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		if (question.authorId.toValue() !== authorId) {
			return left(new NotAllowedError());
		}

		await this.questionsRepository.delete(question);

		return right({});
	}
}
