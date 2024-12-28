import { beforeEach, describe, expect, test } from "vitest";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { InMemoryQuestionsRepository } from "../../../../../test/repositories/in-memory-questions-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question", () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});

	test("it should to answer a question", async () => {
		const { question } = await sut.execute({
			authorId: "1",
			title: "Nova pergunta",
			content: "Conteúdo da pergunta",
		});

		expect(question.id).toBeTruthy();
		expect(inMemoryQuestionsRepository.items[0].id).toEqual(question.id);
	});
});
