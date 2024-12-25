import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Answer } from "../entities/answer";
import type { AnswersRepository } from "../repositories/answers-repository";

interface AnswerQuestionUseCaseRequest {
	instructorId: string;
	questionId: string;
	content: string;
}

export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		questionId,
		instructorId,
		content,
	}: AnswerQuestionUseCaseRequest) {
		const answer = Answer.create({
			content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId)
		});

		await this.answersRepository.create(answer);

		return answer;
	}
}
