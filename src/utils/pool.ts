type PollOptions = {
  timeout?: number;
  interval?: number;
};

export default async function poll<T>(fn: () => Promise<T>, options: PollOptions = {}): Promise<T> {
  const timeout = options.timeout ?? 1000 * 60 * 5;
  const interval = options.interval ?? 3000;

  const endTime = Date.now() + timeout;

  return new Promise<T>((resolve, reject) => {
    const waitForConfirmation = async () => {
      if (Date.now() > endTime) {
        return reject(new Error("Timeout"));
      }

      try {
        const result = await fn();
        if (result) {
          resolve(result);
        } else {
          setTimeout(waitForConfirmation, interval);
        }
      } catch (error) {
        reject(error);
      }
    };

    waitForConfirmation();
  });
}
