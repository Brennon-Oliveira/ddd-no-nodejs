
interface InstructorProps {
  name: string
}

export class Instructor {
  name: string

  constructor({
    name
  }: InstructorProps){
    this.name = name
  }
}
