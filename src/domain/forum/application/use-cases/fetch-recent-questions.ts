import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

interface FetchRecentQuestionsUseCaseRequest {
	page: number;
}

interface FetchRecentQuestionsUseCaseResponse {
	questions: Question[];
}

export class FetchRecentQuestions {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyRecent({
			page,
		});

		return {
			questions,
		};
	}
}
