export function mapDoc<T>(doc: any): T | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest } as T;
}

export function mapDocs<T>(docs: any[]): T[] {
  return docs.map((doc) => mapDoc<T>(doc)!).filter(Boolean);
}
