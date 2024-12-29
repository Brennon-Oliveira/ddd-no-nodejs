import { beforeEach, describe, expect, it, test } from "vitest";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";
import { GetQuestionBySlug } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { makeQuestion } from "../../../../../test/factories/make-question";
import { FetchRecentQuestions } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { FetchQuestionCommentUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { InMemoryQuestionCommentsRepository } from "@test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "@test/factories/make-question-comment";

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentUseCase;

describe("Fetch Question Comments", () => {
	beforeEach(() => {
		inMemoryQuestionCommentRepository =
			new InMemoryQuestionCommentsRepository();
		sut = new FetchQuestionCommentUseCase(inMemoryQuestionCommentRepository);
	});

	it("should to fetch question comments", async () => {
		const questionId = "question-1";

		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID(questionId),
			}),
		);
		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID(questionId),
			}),
		);
		await inMemoryQuestionCommentRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityID(questionId),
			}),
		);

		const { questionComments } = await sut.execute({
			page: 1,
			questionId,
		});

		expect(questionComments).toHaveLength(3);
	});

	it("should be able to fetch paginated question comments", async () => {
		const questionId = "question-1";
		for (let i = 1; i <= 23; i++) {
			await inMemoryQuestionCommentRepository.create(
				makeQuestionComment({
					questionId: new UniqueEntityID(questionId),
				}),
			);
		}

		const { questionComments: firstPage } = await sut.execute({
			questionId,
			page: 1,
		});

		const { questionComments: secondPage } = await sut.execute({
			questionId,
			page: 2,
		});

		expect(firstPage).toHaveLength(20);
		expect(secondPage).toHaveLength(3);
	});
});
