export function PreventNegativeValue() {
  return function(target: Object, key: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: unknown[]) {
      if(args[0] as number < 0) throw new Error(`Tried to call ${originalMethod.name} with a negative value (${args[0]}).`);
      return await originalMethod.apply(this, args);
    }
  };
}