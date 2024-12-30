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

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestions;

describe("Fetch Recent Questions", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new FetchRecentQuestions(inMemoryQuestionsRepository);
	});

	it("should to fetch recent questions", async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 20),
			}),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 18),
			}),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2022, 0, 23),
			}),
		);

		const {
			value: { questions },
		} = await sut.execute({
			page: 1,
		});

		expect(questions).toHaveLength(3);
		expect(questions).toEqual([
			expect.objectContaining({
				createdAt: new Date(2022, 0, 23),
			}),
			expect.objectContaining({
				createdAt: new Date(2022, 0, 20),
			}),
			expect.objectContaining({
				createdAt: new Date(2022, 0, 18),
			}),
		]);
	});

	it("should be able to fetch paginated recent questions", async () => {
		for (let i = 1; i <= 23; i++) {
			await inMemoryQuestionsRepository.create(makeQuestion());
		}

		const {
			value: { questions: firstPage },
		} = await sut.execute({
			page: 1,
		});

		const {
			value: { questions: secondPage },
		} = await sut.execute({
			page: 2,
		});

		expect(firstPage).toHaveLength(20);
		expect(secondPage).toHaveLength(3);
	});
});
