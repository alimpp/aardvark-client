import ReleaseDM from "@/datamodels/releaseDM";
import { JsonParser } from "@/utils/jsonparser";
import { DolphinService } from "@/utils/request";
import {Toast} from '@/utils/toast';
import ResponseDM from "@/datamodels/responseDM"
import {Nullable} from "@/utils/generics";

export default class ReleaseAPI {
    static async LIST(options: {sort?: keyof ReleaseDM, direction?: "ASC" | "DESC", take: number, status?: string, filters?: {[key: string]: (string | number)[] }, skip?: number}) {
        const {sort, direction, take, status, filters, skip} = options;
        const params = {}
        if(sort) params['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
        if(take) params['take'] = take
        if(skip) params['skip'] = skip;
        if (status) params['status'] = status
        if(filters) {
            for(const key in filters) {
                params[key] = `IN(${filters[key].toString()})`
            }
        }

        // @ts-ignore
        const response = await DolphinService({
            url: 'releases',
            method: 'LIST',
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM)
    }

    @Toast<ReleaseDM>(result => `Successfully updated ${result.releaseNumber}`)
    static async UPDATE(params: {release: ReleaseDM, showToast?: boolean}) {
        const form = {};
        form['description'] = params.release.description.trim();
        form['title'] = params.release.title.trim();
        if(params.release.managerId) form['managerId'] = params.release.managerId;
        if(params.release.secondaryManagerId || params.release.secondaryManagerId === null) form['secondaryManagerId'] = params.release.secondaryManagerId;
        if(params.release.cutoff) form['cutoff'] = params.release.cutoff;
        if(params.release.launchDate) form['launchDate'] = params.release.launchDate;
        if(params.release.status) form['status'] = params.release.status;

        // @ts-ignore
        const { data } = await DolphinService({
            url: `releases/${params.release.id}`,
            method: 'UPDATE',
            data: form
        })
        return JsonParser.deserializeObject(data, ReleaseDM);
    }

    @Toast<ReleaseDM>(result => `Successfully created ${result.releaseNumber}`)
    static async CREATE(params: {title: string, managerId: number, description: string, secondaryManagerId: Nullable<number>, cutoff: string, launchDate: string, showToast?: boolean}): Promise<ReleaseDM> {
        // @ts-ignore
        const { data } = await DolphinService({
            url: 'releases',
            method: 'CREATE',
            data: {
                description:params.description.trim(),
                managerId:params.managerId,
                secondaryManagerId:params.secondaryManagerId,
                title:params.title.trim(),
                cutoff:params.cutoff,
                launchDate:params.launchDate
            }
        })
        return JsonParser.deserializeObject(data, ReleaseDM);
    }

    static async COMPLETE(params: {release: ReleaseDM}) {
        // @ts-ignore
        const { data } = await DolphinService({
          url: `releases/${params.release.id}`,
          method: "COMPLETE"
        })
        if(data) {
            return JsonParser.deserializeObject(data, ReleaseDM);
        } else {
            return params.release
        }
      }

    static async PREFLIGHT(params: {id: number, condition: string}) {
      // @ts-ignore
      const { data } = await DolphinService({
        url: `releases/${params.id}/nuggets/${params.condition}`,
        method: "PREFLIGHT"
      })
      return data
    }

    static async LIST_RELEASE_DETAILS(options: {take: number,zone?: string , skip?: number}) {
        const {take ,zone ,skip} = options;
        const params = {}
        if(take) params['take'] = take
        if(skip) params['skip'] = skip;
        if(zone) params['zone'] = zone;
        // @ts-ignore
        const response = await DolphinService({
            url: 'releasedetails',
            method: 'LIST',
            params
        })
        return JsonParser.deserializeObject(response, ResponseDM);
    }


}