import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

interface FetchAnswerCommentUseCaseRequest {
	answerId: string;
	page: number;
}

interface FetchAnswerCommentUseCaseResponse {
	answerComments: AnswerComment[];
}

export class FetchAnswerCommentUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		page,
		answerId,
	}: FetchAnswerCommentUseCaseRequest): Promise<FetchAnswerCommentUseCaseResponse> {
		const answerComments =
			await this.answerCommentsRepository.findManyByAnswerId(answerId, {
				page,
			});

		return {
			answerComments,
		};
	}
}
