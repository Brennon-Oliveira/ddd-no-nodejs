import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id"
import { randomUUID } from "node:crypto"

export class Entity<T> {
  private _id: UniqueEntityID
  protected props: T

  get id(){
    return this._id
  }

  protected constructor(props: T, id?: UniqueEntityID){
    this.props = props
    this._id = id ?? new UniqueEntityID()

  }
}