import { Store } from 'vuex'
import { getModule, VuexModule } from 'vuex-module-decorators'

export type ConstructorOf<C> = { new(...args: any[]): C }
export function getModuleWrapper<M extends VuexModule>(moduleClass: ConstructorOf<M>, store?: Store<any> ): M {
    const module: M = getModule(moduleClass, store);

    if (moduleClass.prototype.onInitialization) {
        // @ts-ignore
        module.onInitialization();
    }

    return module
}
