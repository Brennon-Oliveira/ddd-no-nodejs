import { beforeEach, describe, expect, it, test } from "vitest";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeAnswer } from "@test/factories/make-answer";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository";
import { makeQuestion } from "@test/factories/make-question";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
import { InMemoryAnswerCommentsRepository } from "@test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "@test/factories/make-answer-comment";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete question comment", () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();

		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to comment on question", async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryAnswerCommentsRepository.create(answerComment);

		await sut.execute({
			authorId: "author-1",
			answerCommentId: answerComment.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
	});

	it("should not be able to delete an unexistent question comment", async () => {
		const answerComment = makeAnswerComment(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-comment-1"),
		);

		await inMemoryAnswerCommentsRepository.create(answerComment);

		await expect(() =>
			sut.execute({
				authorId: "author-1",
				answerCommentId: "question-comment-2",
			}),
		).rejects.toBeInstanceOf(Error);
	});

	it("should not be able to delete another user question comment", async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityID("author-1"),
		});

		await inMemoryAnswerCommentsRepository.create(answerComment);

		await expect(() =>
			sut.execute({
				authorId: "author-2",
				answerCommentId: answerComment.id.toString(),
			}),
		).rejects.toBeInstanceOf(Error);
	});
});
