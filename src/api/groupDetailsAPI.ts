import GroupDetailDM from "@/datamodels/groupDetailDM";
import {JsonParser} from "@/utils/jsonparser";
import { JaguarService } from '@/utils/request'
import { ProfileDSModule } from "@/store";

export default class GroupDetailsAPI {

  static async LIST(params: {skip: number, take: number, sort: string, filters?: {[key: string]: string}} = {skip: 0, take: 20, sort: '-recentMessageAt'}) {
    const {skip, take, sort, filters} = params;

    // @ts-ignore
    const { data } = await JaguarService({
      url: `members/${ProfileDSModule.id}/channelviews`,
      method: 'LIST', 
      params: {skip, take, sort, ...filters}
    })
    return JsonParser.deserializeArray(data, GroupDetailDM);
  }

}