export type SQLStoreType = 'procedure' | 'function'

export interface SQLStore{
  name: string,
  content?: string,
  topics?: string[],
  targetContent?: string,
  date?: string,
  type?: SQLStoreType,
  isTest?: boolean
}