import { beforeEach, describe, expect, it, test } from "vitest";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { GetQuestionBySlug } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { FetchRecentQuestions } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answers-repository";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { makeAnswer } from "@test/factories/make-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch Question Answers", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
	});

	it("should to fetch question answers", async () => {
		const questionId = "question-1";

		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID(questionId),
			}),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID(questionId),
			}),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({
				questionId: new UniqueEntityID(questionId),
			}),
		);

		const {
			value: { answers },
		} = await sut.execute({
			page: 1,
			questionId,
		});

		expect(answers).toHaveLength(3);
	});

	it("should be able to fetch paginated question answers", async () => {
		const questionId = "question-1";
		for (let i = 1; i <= 23; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({
					questionId: new UniqueEntityID(questionId),
				}),
			);
		}

		const {
			value: { answers: firstPage },
		} = await sut.execute({
			questionId,
			page: 1,
		});

		const {
			value: { answers: secondPage },
		} = await sut.execute({
			questionId,
			page: 2,
		});

		expect(firstPage).toHaveLength(20);
		expect(secondPage).toHaveLength(3);
	});
});
