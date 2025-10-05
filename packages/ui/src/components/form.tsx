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

interface Control<TValues extends Record<string, unknown>> {
  valuesRef: React.RefObject<TValues>
  errorRef: React.RefObject<FormError<TValues>>
  isPending: boolean
  version: number
  validateValues: (
    values: TValues,
  ) => Promise<
    | { success: true; data: TValues; error: null }
    | { success: false; data: null; error: FormError<TValues> }
  >
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
  onSuccess?: (data: TData) => unknown
  onError?: (error: TError) => unknown
}) => {
  const { defaultValues, schema, onSubmit, onSuccess, onError } = opts

  const valuesRef = React.useRef<TValues>(defaultValues)
  const dataRef = React.useRef<TData | null>(null)
  const errorRef = React.useRef<TError>({ message: null, errors: {} } as TError)
  const [isPending, startTransition] = React.useTransition()
  const [version, setVersion] = React.useState(0)

  const parseIssues = React.useCallback(
    (
      issues: readonly StandardSchemaV1.Issue[],
    ): Record<string, StandardSchemaV1.Issue[]> => {
      return issues.reduce<Record<string, StandardSchemaV1.Issue[]>>(
        (acc, issue) => {
          if (!issue.path || issue.path.length === 0) return acc

          const key =
            typeof issue.path[0] === 'string' ? issue.path[0] : undefined
          if (!key) return acc

          acc[key] ??= []
          acc[key].push(issue)
          return acc
        },
        {},
      )
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
            errors: parseIssues(result.issues),
          } as TError,
        }

      return { success: true, data: result.value, error: null }
    },
    [parseIssues, schema],
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
          return void onSuccess?.(dataRef.current)
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e)
          dataRef.current = null
          errorRef.current = { message, errors: {} } as TError
          return void onError?.(errorRef.current)
        }
      })

      setVersion((v) => v + 1)
    },
    [onSubmit, onSuccess, onError, validateValues],
  )

  const setValue = React.useCallback(
    <K extends keyof TValues>(key: K, value: TValues[K]) => {
      valuesRef.current = { ...valuesRef.current, [key]: value }
      setVersion((v) => v + 1)
    },
    [],
  )

  const reset = React.useCallback(() => {
    valuesRef.current = defaultValues
    dataRef.current = null
    errorRef.current = { message: null, errors: {} } as TError
    setVersion((v) => v + 1)
  }, [defaultValues])

  const control = React.useMemo(
    () => ({ valuesRef, errorRef, isPending, version, validateValues }),
    [isPending, validateValues, version],
  )

  return React.useMemo(
    () => ({
      state: {
        values: valuesRef.current,
        data: dataRef.current,
        error: errorRef.current,
        isPending,
      },
      control,
      setValue,
      handleSubmit,
      reset,
    }),
    [control, handleSubmit, isPending, reset, setValue],
  )
}

interface RenderProps<
  TValues extends Record<string, unknown>,
  TFieldName extends keyof TValues,
> {
  field: {
    id: string
    name: TFieldName
    value: TValues[TFieldName]
    onChange: (
      value: React.ChangeEvent<HTMLInputElement> | string | number | boolean,
    ) => unknown
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => unknown
  }
  meta: {
    fieldId: string
    errorId: string
    descriptionId: string
  }
  state: {
    value: TValues[TFieldName]
    hasError: boolean
    errors: StandardSchemaV1.Issue[]
    isPending: boolean
  }
}

function FormField<
  TValues extends Record<string, unknown>,
  TFieldName extends keyof TValues,
>({
  control,
  name,
  render,
}: {
  control: Control<TValues>
  name: TFieldName
  render: (props: RenderProps<TValues, TFieldName>) => React.ReactNode
}) {
  const { valuesRef, isPending, errorRef, validateValues } = control

  const id = React.useId()

  const [value, setValue] = React.useState(valuesRef.current[name])
  const prevValueRef = React.useRef(value)

  const [errors, setErrors] = React.useState<StandardSchemaV1.Issue[]>(
    errorRef.current.errors?.[name] ?? [],
  )

  React.useEffect(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setValue(valuesRef.current[name])
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setErrors(errorRef.current.errors?.[name] ?? [])
  }, [errorRef, errorRef.current.errors?.[name], name, valuesRef])

  const handleChange = React.useCallback(
    (
      val: Parameters<RenderProps<TValues, TFieldName>['field']['onChange']>[0],
    ) => {
      let newValue
      if (typeof val === 'object' && 'target' in val) {
        const { type, checked, value, valueAsNumber } = val.target
        if (type === 'checkbox') newValue = checked
        else if (type === 'number')
          newValue = isNaN(valueAsNumber) ? '' : valueAsNumber
        else newValue = value
      } else newValue = val

      setValue(newValue as TValues[TFieldName])
      valuesRef.current[name] = newValue as TValues[TFieldName]
    },
    [name, valuesRef],
  )

  const handleBlur = React.useCallback(
    async (_: React.FocusEvent<HTMLInputElement>) => {
      if (prevValueRef.current === value) return
      prevValueRef.current = value

      const { success, error } = await validateValues({
        ...valuesRef.current,
        [name]: value,
      })

      if (!success) setErrors(error.errors?.[name] ?? [])
      else setErrors([])
    },
    [name, validateValues, value, valuesRef],
  )

  const hasError = errors.length > 0

  const meta = React.useMemo(
    () => ({
      fieldId: `${id}-field`,
      errorId: `${id}-message`,
      descriptionId: `${id}-description`,
    }),
    [id],
  )

  const props = React.useMemo(
    () => ({
      meta,
      field: {
        id: meta.fieldId,
        name,
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        'aria-describedby': [meta.descriptionId, hasError && meta.errorId]
          .filter(Boolean)
          .join(' '),
      },
      state: { value, errors, hasError, isPending },
    }),
    [errors, handleBlur, handleChange, hasError, isPending, meta, name, value],
  )

  return render(props)
}

export { useForm, FormField }

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
