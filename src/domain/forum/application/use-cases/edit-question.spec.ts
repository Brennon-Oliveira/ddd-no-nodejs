import { beforeEach, describe, expect, it, test } from "vitest";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { GetQuestionBySlug } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeQuestion } from "@test/factories/make-question";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "@test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "@test/factories/make-question-attachment";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository,
		);
		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentRepository,
		);
	});

	it("should be able to edit a question", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityID("attachment-2"),
			}),
		);

		await sut.execute({
			questionId: "question-1",
			authorId: "author-1",
			title: "Pergunta teste",
			content: "Conteúdo teste",
			attachmentsIds: ["attachment-1", "attachment-3"],
		});

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: "Pergunta teste",
			content: "Conteúdo teste",
		});
		expect(inMemoryQuestionsRepository.items[0].attachments.items).toHaveLength(
			2,
		);
		expect(inMemoryQuestionsRepository.items[0].attachments.items).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityID("attachment-1"),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityID("attachment-3"),
			}),
		]);
	});

	it("should not be able to edit a question from another user", async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityID("author-1"),
			},
			new UniqueEntityID("question-1"),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: "question-1",
			authorId: "author-2",
			title: "Pergunta teste",
			content: "Conteúdo teste",
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryQuestionsRepository.items).toHaveLength(1);
	});
});
