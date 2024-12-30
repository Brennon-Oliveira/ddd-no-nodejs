import { beforeEach, describe, expect, test } from "vitest";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { GetQuestionBySlug } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeQuestion } from "../../../../../test/factories/make-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlug;

describe("Get Question By Slug", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new GetQuestionBySlug(inMemoryQuestionsRepository);
	});

	test("it should to get a question by slug", async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create("example-question"),
		});

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			slug: "example-question",
		});

		expect(result.isRight() ? result.value.question.id : "").toEqual(
			newQuestion.id,
		);
		expect(result.isRight() ? result.value.question.title : "").toEqual(
			newQuestion.title,
		);
		expect(result.isRight() ? result.value.question.content : "").toEqual(
			newQuestion.content,
		);
	});
});
