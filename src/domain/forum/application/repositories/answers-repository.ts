import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";

export interface AnswersRepository {
	create(answer: Answer): Promise<void>;
	findById(id: string): Promise<Answer | null>;
	save(answer: Answer): Promise<void>;
	delete(answer: Answer): Promise<void>;
	findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]>;
}