import { Document, Model } from "mongoose";
import { IBaseRepository } from "../../interfaces/Base/IBaseRepository";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T | null> {
    const document = await new this.model(data).save();
    return document as T | null;
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async update(id: string, updateData: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async findOne(filter: Partial<Record<keyof T, any>>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async findMany(filter: Partial<Record<keyof T, any>>): Promise<T[]> {
    return await this.model.find(filter);
  }

  async findOneAndUpdate(
    filter: Partial<Record<keyof T, any>>,
    updateData: Partial<T>
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(filter, updateData, { new: true });
  }

  async findOneAndDelete(filter: Partial<Record<keyof T, any>>): Promise<T | null> {
    return await this.model.findOneAndDelete(filter);
  }
}
