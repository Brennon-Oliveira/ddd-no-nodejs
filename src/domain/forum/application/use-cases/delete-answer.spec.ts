import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeAnswer } from "@test/factories/make-answer";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";

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

	it("should not be able to delete an unexistent answer", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: "answer-2",
			authorId: "author-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);

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

		const result = await sut.execute({
			answerId: "answer-1",
			authorId: "author-2",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
	});
});
