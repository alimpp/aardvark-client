import {JaguarService} from '@/utils/request'
import {JsonParser} from '@/utils/jsonparser';
import DirectDM from '@/datamodels/directDM';

export default class DirectAPI {

  static async CREATE(params: {userReferenceId: number}): Promise<DirectDM> {
     
    const form = {};
    form['userReferenceId'] = params.userReferenceId;

    // @ts-ignore
    const { data } = await JaguarService({
      url: `directs`,
      data: form,
      method: 'CREATE'
    });
    return JsonParser.deserializeObject(data, DirectDM);
  }

  static async LIST(params: {skip: number, take: number, sort: string} = {skip: 0, take: 20, sort: 'autoModifiedAt'}): Promise<DirectDM[]> {
     
    // @ts-ignore
    const { data } = await JaguarService({
      url: `directs`,
      method: 'LIST',
      params: {skip:params.skip, take:params.take, sort:params.sort}
    })
    return JsonParser.deserializeArray(data, DirectDM);
  }

}
