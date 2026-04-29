export abstract class AbstractUseCase<TInput, TOutput> {
  public abstract execute(input: TInput): Promise<TOutput>
}
