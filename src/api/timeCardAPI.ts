import { DolphinService } from "@/utils/request"
import TimeCardDM from '@/datamodels/timeCardDM';
import { JsonParser } from '@/utils/jsonparser';
import {Toast} from '@/utils/toast';



export default class TimeCardAPI {
  static async LIST(options: {assignmentId: number,  sort?: keyof TimeCardDM, direction?: "ASC" | "DESC"}) {
    const params = {}
    if(options.sort) params['sort'] = `${options.direction === 'ASC' ? '' : '-'}${options.sort}`
    // @ts-ignore
    const { data } = await DolphinService({
      url: `assignments/${options.assignmentId }/timecards`,
      method: 'LIST',
      params
    })
    return JsonParser.deserializeArray(data, TimeCardDM);
  }

  @Toast<TimeCardDM>(() => 'Successfully updated')
  static async UPDATE(params: {assignmentId: number, hours: number, note: string, timecardId: number, showToast?: boolean}) {
    const form = {};
    form['hours'] =  params.hours ;
    form['note'] = params.note.trim();

    // @ts-ignore
    const { data } = await DolphinService({
      url: `assignments/${params.assignmentId}/timecards/${params.timecardId}`,
      method: 'UPDATE',
      data: form
    })
    return JsonParser.deserializeObject(data, TimeCardDM)
  }

  @Toast<TimeCardDM>(() => 'Successfully Created')
  static async CREATE(params: {assignmentId: number, hours: number, note: string, date: string, showToast?: boolean}) {
    const form = {};
    form['hours'] = params.hours;
    form['note'] = params.note.trim();
    form['date'] = params.date;

    // @ts-ignore
    const { data } = await DolphinService({
      url: `assignments/${params.assignmentId}/timecards`,
      method: 'CREATE',
      data: form
    })
    return JsonParser.deserializeObject(data, TimeCardDM)
  }


  @Toast(result => `${result}`)
  static async CLEAR_ZERO_TIMECARD(params: {assignmentId: number,date?: string, showToast?: boolean}) {
      const form = {};
      form['date'] = params.date;

      // @ts-ignore
      await DolphinService({
          url: `assignments/${params.assignmentId}/timecards`,
          method: `CLEAR`,
          data: form
      })
      return `Successfully clear all Zero TimeCards`
    }

}