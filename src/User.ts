import { v4 as uuidv4 } from 'uuid';

export class User {
  private id: string;

  public constructor() {
    this.id = localStorage.getItem("id") ?? uuidv4();
    localStorage.setItem("id", this.id);
  }

  public getId(): string {
    return this.id;
  }
}
