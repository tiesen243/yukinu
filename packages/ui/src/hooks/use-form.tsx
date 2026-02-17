import * as React from 'react'

interface FormError {
  message: string | null
  issues?: StandardSchemaV1.Issue[]
}

type OnChangeParam<TValue> =
  | React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  | TValue

interface FormFieldProps<TName extends keyof TValues, TValues> {
  name: TName
  render: (props: {
    field: {
      id: string
      name: TName
      value: TValues[TName]
      onChange: (params: OnChangeParam<TValues[TName]>) => void
      onBlur: () => void

      // Accessibility attributes
      form: string
      'aria-describedby': string
      'aria-invalid': boolean
    }
    meta: {
      descriptionId: string
      errorId: string
      errors: StandardSchemaV1.Issue[]
      isPending: boolean
    }
  }) => React.ReactNode
}

function extractError(errors: StandardSchemaV1.Issue[], name: string) {
  return errors.filter((issue) => {
    if (!issue.path || issue.path.length === 0) return false
    const firstPath = issue.path[0]
    if (typeof firstPath === 'object' && 'key' in firstPath)
      return firstPath.key === name
    return firstPath === name
  })
}

export function useForm<
  TValues,
  TData,
  TError extends FormError,
  TSchema extends
    | StandardSchemaV1
    | ((values: TValues) => TResults | Promise<TResults>),
  TResults extends StandardSchemaV1.Result<TValues>,
>(props: {
  defaultValues: TValues
  schema?: TSchema
  onSubmit: (data: TValues) => TData | Promise<TData>
  onSuccess?: (data: TData) => unknown | Promise<unknown>
  onError?: (error: TError) => unknown | Promise<unknown>
}): {
  formId: string
  Field: <TName extends keyof TValues>(
    props: FormFieldProps<TName, TValues>,
  ) => React.ReactNode
  handleSubmit: (event?: React.SubmitEvent) => void
  state: {
    values: TValues
    data: TData | null
    error: TError | null
    isPending: boolean
  }
  reset: () => void
} {
  const { defaultValues, schema, onSubmit, onSuccess, onError } = props

  const formId = React.useId()
  const formValuesRef = React.useRef<TValues>(defaultValues)
  const formDataRef = React.useRef<TData | null>(null)
  const formErrorRef = React.useRef<TError | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const setFormValue = React.useCallback(
    <TKey extends keyof TValues>(field: TKey, value: TValues[TKey]) => {
      formValuesRef.current = { ...formValuesRef.current, [field]: value }
    },
    [],
  )

  const validate = React.useCallback(
    async (values: TValues): Promise<TValues> => {
      if (!schema) return values

      let result
      if (typeof schema === 'function') result = await schema(values)
      else result = await schema['~standard'].validate(values)

      if ('issues' in result) throw result.issues
      return (result.value ?? result) as TValues
    },
    [schema],
  )

  const handleSubmit = React.useCallback(
    (event?: React.SubmitEvent) => {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      formDataRef.current = null
      formErrorRef.current = null

      startTransition(async () => {
        try {
          const validValues = await validate(formValuesRef.current)
          formValuesRef.current = validValues

          const result = await onSubmit(validValues)
          formDataRef.current = result ?? null
          await onSuccess?.(result)
        } catch (error) {
          let issues: FormError['issues']
          if (Array.isArray(error)) issues = error

          let message = 'Validate failed'
          if (error instanceof Error) message = error.message

          formErrorRef.current = { message, issues } as TError
          await onError?.(formErrorRef.current)
        }
      })
    },
    [onSubmit, onSuccess, onError, validate],
  )

  const Field = React.useCallback(
    function FormField<TName extends keyof TValues>({
      name,
      render,
    }: FormFieldProps<TName, TValues>) {
      const id = React.useId()

      const [value, setValue] = React.useState(
        () => formValuesRef.current[name],
      )
      const prevValueRef = React.useRef(value)

      const [errors, setErrors] = React.useState<StandardSchemaV1.Issue[]>(() =>
        extractError(formErrorRef.current?.issues ?? [], name as string),
      )

      const onChange = React.useCallback(
        (param: OnChangeParam<TValues[TName]>) => {
          if (param === null) return

          setErrors([])

          let newValue
          if (typeof param === 'object' && 'target' in param) {
            const target = param.target as HTMLInputElement

            if (target.type === 'checkbox') newValue = target.checked
            else if (target.type === 'number')
              newValue = isNaN(target.valueAsNumber) ? 0 : target.valueAsNumber
            else newValue = target.value
          } else newValue = param as TValues[TName]

          setValue(newValue as TValues[TName])
          setFormValue(name, newValue as TValues[TName])
        },
        [name],
      )

      const onBlur = React.useCallback(async () => {
        if (prevValueRef.current === value) return
        prevValueRef.current = value

        try {
          const result = await validate({
            ...formValuesRef.current,
            [name]: value,
          })
          setFormValue(name, result[name])
        } catch (error) {
          if (!Array.isArray(error)) return
          setErrors(extractError(error, name as string))
        }
      }, [name, value])

      const meta = React.useMemo(
        () => ({
          descriptionId: `form-${formId}-field-${id}-description`,
          errorId: `form-${formId}-field-${id}-error`,
          errors,
          isPending,
        }),
        [id, errors],
      )

      return render({
        field: {
          id: `form-${formId}-field-${id}`,
          name,
          value,
          onChange,
          onBlur,

          form: `form-${formId}`,
          'aria-describedby':
            meta.errors.length > 0
              ? `${meta.descriptionId} ${meta.errorId}`
              : meta.descriptionId,
          'aria-invalid': meta.errors.length > 0,
        },
        meta,
      })
    },
    [formId, setFormValue, validate, isPending],
  )

  const reset = React.useCallback(
    () =>
      startTransition(() => {
        formValuesRef.current = defaultValues
        formDataRef.current = null
        formErrorRef.current = null
      }),
    [defaultValues],
  )

  return React.useMemo(
    () => ({
      formId: `form-${formId}`,
      Field,
      handleSubmit,
      state: {
        get values() {
          return formValuesRef.current
        },
        get data() {
          return formDataRef.current
        },
        get error() {
          return formErrorRef.current
        },
        get isPending() {
          return isPending
        },
      },
      reset,
    }),
    [formId, Field, handleSubmit, isPending, reset],
  )
}

/** The Standard Schema interface. */
interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly '~standard': StandardSchemaV1.Props<Input, Output>
}

declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  export interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1
    /** The vendor name of the schema library. */
    readonly vendor: string
    /** Validates unknown input values. */
    readonly validate: (
      value: unknown,
      options?: StandardSchemaV1.Options | undefined,
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
    /** A falsy value for `issues` indicates success. */
    readonly issues?: undefined
  }

  export interface Options {
    /** Explicit support for additional vendor-specific parameters, if needed. */
    readonly libraryOptions?: Record<string, unknown> | undefined
  }

  /** The result interface if validation fails. */
  export interface FailureResult {
    /** The issues of failed validation. */
    readonly issues: ReadonlyArray<Issue>
  }

  /** The issue interface of the failure output. */
  export interface Issue {
    /** The error message of the issue. */
    readonly message: string
    /** The path of the issue, if any. */
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined
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
