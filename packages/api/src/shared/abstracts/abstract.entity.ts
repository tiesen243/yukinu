import { createId } from '@yukinu/lib/create-id'

export abstract class AbstractEntity<
  TEntity,
  TId extends string | number = string,
> {
  public id: TId = createId() as TId
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
  type DefaultSystemMethods = 'clone' | 'toJSON'

  type NullableKeys<T> = {
    [K in keyof T]: null extends T[K] ? K : never
  }[keyof T]

  export type EntityProps<T, TOptional extends keyof T = never> = Omit<
    Pick<
      T,
      Exclude<
        keyof T,
        NullableKeys<T> | (DefaultSystemProps & keyof T) | TOptional
      >
    > &
      Partial<
        Pick<
          T,
          Extract<
            keyof T,
            NullableKeys<T> | (DefaultSystemProps & keyof T) | TOptional
          >
        >
      >,
    DefaultSystemMethods
  >
}
