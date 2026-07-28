interface MockQueryResult {
  data: unknown | null;
  count?: number | null;
  error: Error | null;
}

function createMockBuilder(data: unknown[] | null, count?: number | null) {
  let isSingle = false;

  const getResult = (): MockQueryResult => ({
    data: isSingle && data ? (data[0] ?? null) : data,
    count: isSingle ? undefined : count,
    error: null,
  });

  const builder: {
    select: jest.Mock;
    eq: jest.Mock;
    not: jest.Mock;
    single: jest.Mock;
    then: (onFulfilled: (value: MockQueryResult) => unknown) => Promise<unknown>;
    catch: (onRejected: (reason: unknown) => unknown) => Promise<unknown>;
    finally: (onFinally: () => void) => Promise<unknown>;
  } = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    not: jest.fn(() => builder),
    single: jest.fn(() => {
      isSingle = true;
      return builder;
    }),
    then: (onFulfilled) =>
      Promise.resolve(getResult()).then(onFulfilled),
    catch: (onRejected) =>
      Promise.resolve(getResult()).catch(onRejected),
    finally: (onFinally) =>
      Promise.resolve(getResult()).finally(onFinally),
  };

  return builder;
}

export function createMockSupabaseClient() {
  const from = jest.fn();
  return { from };
}

export function createMockAdminClient() {
  const upsert = jest.fn().mockResolvedValue({ error: null });
  const from = jest.fn().mockReturnValue({ upsert });
  return { from };
}

export { createMockBuilder };
