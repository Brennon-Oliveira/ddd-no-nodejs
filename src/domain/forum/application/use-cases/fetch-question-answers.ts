import { right, type Either } from "@/core/either";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";
import type { Question } from "@/domain/forum/enterprise/entities/question";

interface FetchQuestionAnswersUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
	never,
	{
		answers: Answer[];
	}
>;

export class FetchQuestionAnswersUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		page,
		questionId,
	}: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			questionId,
			{
				page,
			},
		);

		return right({
			answers,
		});
	}
}
