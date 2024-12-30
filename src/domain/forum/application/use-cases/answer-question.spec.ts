import { beforeEach, describe, expect, test } from "vitest";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers-repository";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe("Answer Question", () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository();
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	test("it should to answer a question", async () => {
		const result = await sut.execute({
			content: "Minha resposta",
			instructorId: "1",
			questionId: "1",
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswersRepository.items[0].id).toEqual(
			result.value?.answer.id,
		);
	});
});
