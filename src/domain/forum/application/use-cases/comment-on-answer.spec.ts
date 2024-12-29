import { beforeEach, describe, expect, it, test } from "vitest";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeAnswer } from "@test/factories/make-answer";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answers-repository";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { InMemoryAnswerCommentsRepository } from "@test/repositories/in-memory-answer-comments-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CommentOnAnswerUseCase;

describe("Comment On Answer", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository();

		sut = new CommentOnAnswerUseCase(
			inMemoryAnswerCommentsRepository,
			inMemoryAnswersRepository,
		);
	});

	it("should be able to comment on answer", async () => {
		const answer = makeAnswer({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			authorId: "author-2",
			content: "Comentário teste",
			answerId: answer.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
			"Comentário teste",
		);
	});

	it("should not be able to comment in an unexistent answer", async () => {
		const answer = makeAnswer({}, new UniqueEntityID("answer-1"));

		await inMemoryAnswersRepository.create(answer);

		await expect(() =>
			sut.execute({
				content: "Comentário teste",
				authorId: "author-2",
				answerId: "answer-2",
			}),
		).rejects.toBeInstanceOf(Error);
	});
});
