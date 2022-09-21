import Vue from 'vue';
import { ToastOptions } from 'vue-toast-notification';

export function createToastNotification(message: string, options: Omit<ToastOptions, 'message'> = {position: 'bottom'}) {
  Vue.$toast.open({
    message,
    ...options
  })
}

/**
 * Wraps the API method, requires a formatter callback, and creates a toast notification with that callback on success.
 * @param messageFormatter Callback that gets passed the result of the API method, should return a string.
 * @param options [ToastOptions](https://github.com/ankurk91/vue-toast-notification#available-options).
 */
export function Toast<T>(messageFormatter: (result: T) => string, options?: Omit<ToastOptions, 'message'>) {
  return function(target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: unknown[]) {
      const { showToast } = args[0] as { showToast: boolean | undefined };
      const result = await originalMethod.apply(this, args) as T;
      if(result && showToast !== false) createToastNotification( messageFormatter(result), options );
      return result;
    }
  };
}
