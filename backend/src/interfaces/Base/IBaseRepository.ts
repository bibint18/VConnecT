
export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T|null>
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  update(id: string, updateData: Partial<T>): Promise<T | null>
  delete(id: string): Promise<boolean>
  findOne(filter: Partial<Record<keyof T, any>>): Promise<T | null>
  findMany(filter: Partial<Record<keyof T, any>>): Promise<T[]>
  findOneAndUpdate(filter: Partial<Record<keyof T, any>>, updateData: Partial<T>): Promise<T | null>;
  findOneAndDelete(filter: Partial<Record<keyof T, any>>): Promise<T | null>;
}
