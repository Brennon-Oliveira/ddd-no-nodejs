import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { GetQuestionBySlug } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeQuestion } from "@test/factories/make-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to edit a question", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		await sut.execute({
			questionId: "question-1",
			authorId: "author-1",
			title: "Pergunta teste",
			content: "Conteúdo teste",
		});

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: "Pergunta teste",
			content: "Conteúdo teste",
		});
	});

	it("should not be able to edit a question from another user", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		await expect(() =>
			sut.execute({
				questionId: "question-1",
				authorId: "author-2",
				title: "Pergunta teste",
				content: "Conteúdo teste",
			}),
		).rejects.toBeInstanceOf(Error);
		expect(inMemoryQuestionsRepository.items).toHaveLength(1);
	});
});