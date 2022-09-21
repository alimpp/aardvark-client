import { DolphinService } from "@/utils/request"
import HolidayDM from '@/datamodels/holidayDM';
import HolidayTypeDM from '@/datamodels/holidayTypesDM';
import { JsonParser } from '@/utils/jsonparser';
import { Toast } from '@/utils/toast';

export default class HolidayAPI {

  static async LIST(params: { sort?: keyof HolidayDM, direction?: "ASC" | "DESC", take?: number, filters?: { [key: string]: (string | number)[] }, skip?: number, holidayTypeId?: number} = {}) {
    const { sort, direction, take, filters, skip, holidayTypeId } = params;
    const localParams = {}
    if (sort) localParams['sort'] = `${direction === 'ASC' ? '' : '-'}${sort}`
    if (take) localParams['take'] = take
    if (skip) localParams['skip'] = skip;
    if (holidayTypeId) localParams['holidayTypeId'] = holidayTypeId
    if (filters) {
      for (const key in filters) {
        if (filters[key].toString() === 'active') {
          localParams[key] = '\0'
        } else if (filters[key].toString() === 'inactive') {
          localParams[key] = '!\0'
        } else if (filters[key].toString().includes('active' && 'inactive')) {
          localParams[key] = null
        } else {
          localParams[key] = `IN(${filters[key].toString()})`
        }
      }
    }

    // @ts-ignore
    const { data } = await DolphinService({
      url: `holidays`,
      method: 'LIST',
      params: localParams
    })
    return JsonParser.deserializeArray(data, HolidayDM);
  }

  static async TYPES(): Promise<HolidayTypeDM[]> {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `holidaytypes`,
      method: "LIST",
    })
    return JsonParser.deserializeArray(data, HolidayTypeDM);
  }

  @Toast<HolidayDM>(() => 'Successfully Updated')
  static async UPDATE(params: {holiday: HolidayDM, showToast?: boolean}): Promise<HolidayDM> {
     
    const form = {};
    form['title'] = params.holiday.title;
    form['startDate'] = params.holiday.startDate;
    form['endDate'] = params.holiday.endDate;
    form['holidayTypeId'] = params.holiday.holidayTypeId;
    form['repeat'] = params.holiday.repeat;
    params.holiday.removedAt === '' ? form['removedAt'] = null : form['removedAt'] = params.holiday.removedAt

    // @ts-ignore
    const { data } = await DolphinService({
      url: `holidays/${params.holiday.id}`,
      method: 'UPDATE',
      data: form
    })
    return JsonParser.deserializeObject(data, HolidayDM)
  }

  @Toast<HolidayDM>(() => `Successfully Created Holiday`)
  static async CREATE(params: {title: string, startDate: string, endDate: string, repeat: string, holidayTypeId: number, showToast?: boolean}) {
    // @ts-ignore
    
    const { data } = await DolphinService({
      url: 'holidays',
      method: 'ADD',
      data: {
        title: params.title,
        startDate: params.startDate,
        endDate: params.endDate,
        repeat: params.repeat,
        holidayTypeId: params.holidayTypeId
      }
    })
    return JsonParser.deserializeObject(data, HolidayDM);
  }
  @Toast<HolidayDM>(() => `Successfully Deleted Holiday`)
  static async DELETE(params: {holidayId: number, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `holidays/${params.holidayId}`,
      method: 'DELETE'
    })
    return JsonParser.deserializeObject(data, HolidayDM)
  }

}
