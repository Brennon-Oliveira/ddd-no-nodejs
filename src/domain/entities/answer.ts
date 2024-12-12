
interface AnswerProps {
  content: string
  authorId: string
  questionId: string
}

export class Answer {
  content: string
  authorId: string
  questionId: string

  constructor({
    authorId,
    content,
    questionId
  }: AnswerProps){
    this.content = content
    this.authorId = authorId
    this.questionId = questionId
  }
}
