
interface QuestionProps {
  content: string
  authorId: string
}

export class Question {
  content: string
  authorId: string

  constructor({
    authorId,
    content,
  }: QuestionProps){
    this.content = content
    this.authorId = authorId
  }
}
