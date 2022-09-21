import { Action, Module } from 'vuex-module-decorators'
import BaseItemDS from './base/baseItemDS';
import CacheControlDM from '@/datamodels/cacheControlDM';
import hash from 'object-hash';

@Module({ name: 'cachecontrolds', namespaced: true })
export class CacheControlDs extends BaseItemDS<CacheControlDM> {
    get getCacheControl() {
        return (hash: string) => {
            return this.items[hash]
        }
    }
    
    @Action({rawError: true})
    saveCacheControl(data: {cacheControl: string , response: any }) {
        const cacheControl = new CacheControlDM(); 
        cacheControl.date = new Date() ;
        cacheControl.cacheControl = data.cacheControl ;
        cacheControl.id = hash({baseURL: data.response.config.baseURL, params: data.response.config.params}) ;
        cacheControl.respons = data.response;
        this.addOrReplaceItem(cacheControl)
    }



    @Action({ rawError: true })
    async doLoad() {
        return
    }
}
