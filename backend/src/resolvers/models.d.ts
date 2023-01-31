export interface Collection {
  _key: string;
  _id: string;
  _rev: string;
}

export interface Edge extends Collection<From, To> {
  _from: string;
  _to: string;
}
