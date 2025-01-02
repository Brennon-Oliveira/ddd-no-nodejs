import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface AnswerAttachmentProps {
	answerId: UniqueEntityID;
	attachmentId: UniqueEntityID;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
	get answerId() {
		return this.props.answerId;
	}
	get attchmentId() {
		return this.props.attachmentId;
	}

	static create(props: AnswerAttachmentProps, id?: UniqueEntityID) {
		const attachment = new AnswerAttachment(props, id);

		return attachment;
	}
}
