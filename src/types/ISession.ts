export interface ISession {
  map: {[id: string]: {
    user: {[id: string]: number | null}
  } | null}
}
