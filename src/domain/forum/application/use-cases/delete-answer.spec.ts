import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeAnswer } from "@test/factories/make-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
	});

	it("should be able to delete a answer", async () => {
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
		});

		expect(inMemoryAnswersRepository.items).toHaveLength(0);
	});

	it("should not be able to delete a answer from another user", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		await expect(() =>
			sut.execute({
				answerId: "answer-2",
				authorId: "author-1",
			}),
		).rejects.toBeInstanceOf(Error);
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
	});

	it("should not be able to delete a answer from another user", async () => {
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
			}),
		).rejects.toBeInstanceOf(Error);
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
	});
});
