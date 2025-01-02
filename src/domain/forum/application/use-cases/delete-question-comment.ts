import { left, right, type Either } from "@/core/either";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string;
	questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{}
>;

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		authorId,
		questionCommentId,
	}: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const questionComment =
			await this.questionCommentsRepository.findById(questionCommentId);

		if (!questionComment) {
			return left(new ResourceNotFoundError());
		}

		if (questionComment.authorId.toString() !== authorId) {
			return left(new NotAllowedError());
		}

		await this.questionCommentsRepository.delete(questionComment);

		return right({});
	}
}
