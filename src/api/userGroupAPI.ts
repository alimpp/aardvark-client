import { JaguarService } from "@/utils/request"
import { JsonParser } from '@/utils/jsonparser'
import GroupDM from '@/datamodels/groupDM';

export default class UserGroupAPI {
  
  static async LIST(params: {userId: number}) {
    // @ts-ignore
    const { data } = await JaguarService({
      url: `members/${params.userId}/channels`,
      method: 'LIST'
    })
    return JsonParser.deserializeArray(data || [], GroupDM)
  }

}
