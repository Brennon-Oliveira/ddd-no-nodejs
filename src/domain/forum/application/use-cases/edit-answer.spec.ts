import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeAnswer } from "@test/factories/make-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new EditAnswerUseCase(inMemoryAnswersRepository);
	});

	it("should be able to edit a answer", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		await sut.execute({
			answerId: "answer-1",
			authorId: "author-1",
			content: "Conteúdo teste",
		});

		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: "Conteúdo teste",
		});
	});

	it("should not be able to edit a answer from another user", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		await expect(() =>
			sut.execute({
				answerId: "answer-1",
				authorId: "author-2",
				content: "Conteúdo teste",
			}),
		).rejects.toBeInstanceOf(Error);
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
	});
});
