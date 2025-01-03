import { WatchedList } from "@/core/entities/watched-list";
import type { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class QuestionAttachmentsList extends WatchedList<QuestionAttachment> {
	compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
		return a.attachmentId.equals(b.attachmentId);
	}
}
