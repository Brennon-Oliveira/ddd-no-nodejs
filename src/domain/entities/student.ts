
interface StudentProps {
  name: string
}

export class Student {
  name: string

  constructor({
    name
  }: StudentProps){
    this.name = name
  }
}
