import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeAnswer } from "@test/factories/make-answer";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "@test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "@test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentRepository =
			new InMemoryAnswerAttachmentRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentRepository,
		);
		sut = new EditAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerAttachmentRepository,
		);
	});

	it("should be able to edit a answer", async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("answer-1"),
		);

		await inMemoryAnswersRepository.create(newAnswer);

		inMemoryAnswerAttachmentRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityID("attachment-2"),
			}),
		);

		await sut.execute({
			answerId: "answer-1",
			authorId: "author-1",
			content: "Conteúdo teste",
			attachmentsIds: ["attachment-1", "attachment-3"],
		});

		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: "Conteúdo teste",
		});
		expect(inMemoryAnswersRepository.items[0].attachments.items).toHaveLength(
			2,
		);
		expect(inMemoryAnswersRepository.items[0].attachments.items).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityID("attachment-3"),
			}),
		]);
	});

	it("should not be able to edit a answer from another user", async () => {
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
			content: "Conteúdo teste",
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryAnswersRepository.items).toHaveLength(1);
	});
});
