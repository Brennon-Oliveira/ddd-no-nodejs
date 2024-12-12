import { Answer } from "../entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
}

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository){}
  
  async execute({
    questionId,
    instructorId,
    content
  }: AnswerQuestionUseCaseRequest){
    const answer = new Answer({
      content,
      questionId,
      authorId: instructorId
    })

    await this.answersRepository.create(answer)

    return answer
  }
} 
