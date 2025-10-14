'use client'

import * as React from 'react'

interface FormError<TValue extends Record<string, unknown>> {
  message: string | null
  errors?: Record<keyof TValue, StandardSchemaV1.Issue[]>
}

type ExtractValues<T extends StandardSchemaV1> = {
  [K in keyof Required<StandardSchemaV1.InferInput<T>>]: Required<
    StandardSchemaV1.InferInput<T>
  >[K]
}

interface RenderProps<
  TValue extends Record<string, unknown>,
  TFieldName extends keyof TValue,
  TElement extends HTMLElement = HTMLInputElement,
> {
  meta: {
    fieldId: string
    descriptionId: string
    errorId: string
    errors: StandardSchemaV1.Issue[]
    isPending: boolean
  }
  field: {
    id: string
    name: TFieldName
    value: TValue[TFieldName]
    onChange: (event: React.ChangeEvent<TElement>) => void
    onBlur: (event: React.FocusEvent<TElement>) => Promise<void>
    'aria-describedby': string
    'aria-invalid': boolean
  }
}

const useForm = <
  TValues extends Record<string, unknown>,
  TData,
  TError extends FormError<TValues>,
  TSchema extends
    | StandardSchemaV1
    | ((value: TValues) => TResults | Promise<TResults>),
  TResults extends StandardSchemaV1.Result<TValues>,
>(opts: {
  defaultValues: TValues
  schema?: TSchema extends StandardSchemaV1
    ? ExtractValues<TSchema> extends TValues
      ? TSchema
      : never
    : (value: TValues) => TResults | Promise<TResults>
  onSubmit: (data: TValues) => TData | Promise<TData>
  onSuccess?: (data: TData) => void
  onError?: (error: TError) => void
}) => {
  const { defaultValues, schema, onSubmit, onSuccess, onError } = opts

  const valuesRef = React.useRef<TValues>(defaultValues)
  const dataRef = React.useRef<TData | null>(null)
  const errorRef = React.useRef<TError>({ message: null, errors: {} } as TError)
  const [isPending, startTransition] = React.useTransition()

  const getValues = React.useCallback(() => {
    return valuesRef.current
  }, [])

  const getData = React.useCallback(() => {
    return dataRef.current
  }, [])

  const getError = React.useCallback(() => {
    return errorRef.current
  }, [])

  const setValue = React.useCallback(
    <K extends keyof TValues>(key: K, value: TValues[K]) => {
      valuesRef.current = { ...valuesRef.current, [key]: value }
    },
    [],
  )

  const validateValues = React.useCallback(
    async (
      values: TValues,
    ): Promise<
      | { success: true; data: TValues; error: null }
      | { success: false; data: null; error: TError }
    > => {
      if (!schema) return { success: true, data: values, error: null }

      let result: TResults
      if ('~standard' in schema)
        result = (await schema['~standard'].validate(values)) as TResults
      else result = await schema(values)

      if (result.issues)
        return {
          success: false,
          data: null,
          error: {
            message: 'Validation error',
            errors: result.issues.reduce<
              Record<string, StandardSchemaV1.Issue[]>
            >((acc, issue) => {
              if (!issue.path || issue.path.length === 0) return acc

              const key =
                typeof issue.path[0] === 'string' ? issue.path[0] : undefined
              if (!key) return acc

              acc[key] ??= []
              acc[key].push(issue)
              return acc
            }, {}),
          } as TError,
        }

      return { success: true, data: result.value, error: null }
    },
    [schema],
  )

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()

      startTransition(async () => {
        dataRef.current = null
        errorRef.current = { message: null, errors: {} } as TError

        const { success, data, error } = await validateValues(valuesRef.current)
        if (!success) return void (errorRef.current = error)

        try {
          dataRef.current = await onSubmit(data)
          errorRef.current = { message: null, errors: {} } as TError
          return onSuccess?.(dataRef.current)
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e)
          dataRef.current = null
          errorRef.current = { message, errors: {} } as TError
          return onError?.(errorRef.current)
        }
      })
    },
    [onSubmit, onSuccess, onError, validateValues],
  )

  const Field = React.useCallback(
    function FormField<
      TFieldName extends keyof TValues,
      TElement extends HTMLElement = HTMLInputElement,
    >(props: {
      name: TFieldName
      render: (
        props: RenderProps<TValues, TFieldName, TElement>,
      ) => React.ReactNode
    }) {
      const [localValue, setLocalValue] = React.useState<TValues[TFieldName]>(
        valuesRef.current[props.name],
      )
      const [errors, setErrors] = React.useState<StandardSchemaV1.Issue[]>(
        errorRef.current.errors?.[props.name] ?? [],
      )
      const prevLocalValueRef = React.useRef(localValue)

      const handleChange = (event: React.ChangeEvent<TElement>) => {
        event.persist()
        setErrors([])

        let newValue
        const { type, checked, value, valueAsNumber } =
          event.target as unknown as HTMLInputElement
        if (type === 'checkbox') newValue = checked
        else if (type === 'number')
          newValue = isNaN(valueAsNumber) ? '' : valueAsNumber
        else newValue = value

        setLocalValue(newValue as TValues[TFieldName])
        setValue(props.name, newValue as TValues[TFieldName])
      }

      const handleBlur = async (event: React.FocusEvent<TElement>) => {
        event.persist()
        if (prevLocalValueRef.current === localValue) return
        prevLocalValueRef.current = localValue

        const { success, error } = await validateValues({
          ...valuesRef.current,
          [props.name]: localValue,
        })
        if (success) setValue(props.name, localValue)
        else setErrors(error.errors?.[props.name] ?? [])
      }

      return props.render({
        meta: {
          fieldId: `${String(props.name)}-field`,
          descriptionId: `${String(props.name)}-description`,
          errorId: `${String(props.name)}-error`,
          errors,
          isPending,
        },
        field: {
          id: `${String(props.name)}-field`,
          name: props.name,
          value: localValue,
          onChange: handleChange,
          onBlur: handleBlur,
          'aria-invalid': errors.length > 0,
          'aria-describedby':
            errors.length > 0
              ? `${String(props.name)}-error ${String(props.name)}-description`
              : `${String(props.name)}-description`,
        },
      })
    },
    [isPending, setValue, validateValues],
  )

  return React.useMemo(
    () => ({
      state: { getValues, getData, getError, isPending },
      Field,
      setValue,
      handleSubmit,
    }),
    [Field, getData, getError, getValues, handleSubmit, isPending, setValue],
  )
}

export { useForm }

/** The Standard Schema interface. */
export interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly '~standard': StandardSchemaV1.Props<Input, Output>
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  export interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1
    /** The vendor name of the schema library. */
    readonly vendor: string
    /** Validates unknown input values. */
    readonly validate: (
      value: unknown,
    ) => Result<Output> | Promise<Result<Output>>
    /** Inferred types associated with the schema. */
    readonly types?: Types<Input, Output> | undefined
  }

  /** The result interface of the validate function. */
  export type Result<Output> = SuccessResult<Output> | FailureResult

  /** The result interface if validation succeeds. */
  export interface SuccessResult<Output> {
    /** The typed output value. */
    readonly value: Output
    /** The non-existent issues. */
    readonly issues?: undefined
  }

  /** The result interface if validation fails. */
  export interface FailureResult {
    /** The issues of failed validation. */
    readonly issues: readonly Issue[]
  }

  /** The issue interface of the failure output. */
  export interface Issue {
    /** The error message of the issue. */
    readonly message: string
    /** The path of the issue, if any. */
    readonly path?: readonly (PropertyKey | PathSegment)[] | undefined
  }

  /** The path segment interface of the issue. */
  export interface PathSegment {
    /** The key representing a path segment. */
    readonly key: PropertyKey
  }

  /** The Standard Schema types interface. */
  export interface Types<Input = unknown, Output = Input> {
    /** The input type of the schema. */
    readonly input: Input
    /** The output type of the schema. */
    readonly output: Output
  }

  /** Infers the input type of a Standard Schema. */
  export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['input']

  /** Infers the output type of a Standard Schema. */
  export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
    Schema['~standard']['types']
  >['output']
}
