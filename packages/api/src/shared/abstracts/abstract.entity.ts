import { createId } from '@yukinu/lib/create-id'

export abstract class AbstractEntity<
  TEntity,
  TPrimaryKey extends string | number = string,
> {
  public id: TPrimaryKey = createId() as TPrimaryKey
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()

  public constructor(props: AbstractEntity.EntityProps<TEntity>) {
    if (props) Object.assign(this, props)
  }

  public clone(override: Partial<Omit<TEntity, 'clone'>>): TEntity {
    // oxlint-disable-next-line typescript/no-explicit-any
    return new (this.constructor as any)({ ...this, ...override })
  }

  public toJSON(): Omit<TEntity, 'clone' | 'toJSON'> {
    const { clone: _, toJSON: __, ...rest } = this
    return rest as unknown as Omit<TEntity, 'clone' | 'toJSON'>
  }
}

export namespace AbstractEntity {
  type DefaultSystemProps = 'id' | 'createdAt' | 'updatedAt'

  type DataKeys<T> = {
    // oxlint-disable-next-line typescript/no-explicit-any
    [K in keyof T]: T[K] extends (...args: any[]) => any
      ? never
      : (<U>() => U extends { [P in K]: T[P] } ? 1 : 2) extends <
            U,
          >() => U extends { readonly [P in K]: T[P] } ? 1 : 2
        ? never
        : K
  }[keyof T]

  type NullableKeys<T> = {
    [K in keyof T]: null extends T[K] ? K : never
  }[keyof T]

  export type EntityProps<T, TOptional extends keyof T = never> = Pick<
    T,
    Exclude<
      DataKeys<T>,
      NullableKeys<T> | (DefaultSystemProps & keyof T) | TOptional
    >
  > &
    Partial<
      Pick<
        T,
        Extract<
          DataKeys<T>,
          NullableKeys<T> | (DefaultSystemProps & keyof T) | TOptional
        >
      >
    >
}
