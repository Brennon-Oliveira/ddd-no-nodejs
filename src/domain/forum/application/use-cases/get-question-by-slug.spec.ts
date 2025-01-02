import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { GetQuestionBySlug } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { InMemoryQuestionAttachmentRepository } from "@test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlug;

describe("Get Question By Slug", () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentRepository =
			new InMemoryQuestionAttachmentRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentRepository,
		);
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
