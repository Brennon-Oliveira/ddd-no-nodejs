import { expect, test } from "vitest";
import type { AnswersRepository } from "../repositories/answers-repository";
import { AnswerQuestionUseCase } from "./answer-question";

const fakeAnswersRepository: AnswersRepository = {
	create: async () => {
		return;
	},
};

test("it should to answer a question", async () => {
	const sut = new AnswerQuestionUseCase(fakeAnswersRepository);

	const answer = await sut.execute({
		content: "Minha resposta",
		instructorId: "1",
		questionId: "1",
	});

	expect(answer.content).toEqual("Minha resposta");
});
