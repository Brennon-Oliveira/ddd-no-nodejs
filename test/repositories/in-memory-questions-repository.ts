import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import type { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	async create(question: Question): Promise<void> {
		this.items.push(question);
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((item) => item.slug.value === slug);

		return question ?? null;
	}

	async findById(id: string): Promise<Question | null> {
		const question = this.items.find((item) => item.id.toValue() === id);

		if (!question) {
			return null;
		}

		return question;
	}

	async delete(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items.splice(itemIndex, 1);
	}

	async save(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex((item) => item.id === question.id);

		this.items[itemIndex] = question;
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return questions;
	}
}
