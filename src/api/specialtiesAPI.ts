import SpecialtyDM from '@/datamodels/specialtyDM'
import { JsonParser } from '@/utils/jsonparser'
import { DolphinService } from '@/utils/request'
import { Toast } from '@/utils/toast';

export default class SpecialtiesAPI {

  static async LIST(): Promise<SpecialtyDM[]> {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `specialties`,
      method: 'LIST'
    })
    return JsonParser.deserializeArray(data, SpecialtyDM);
  }

  @Toast<SpecialtyDM>(() => `Specialty Successfully created`)
  static async CREATE(params: {title: string, skillId: number}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: 'specialties',
      method: 'CREATE',
      data: {
        title: params.title,
        skillId: params.skillId
      }
    })
    return JsonParser.deserializeObject(data, SpecialtyDM);
  }

  @Toast<SpecialtyDM>(() => `Specialty Successfully deleted`)
  static async DELETE(params: {specialtyId: number, showToast?: boolean}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `specialties/${params.specialtyId}`,
      method: 'DELETE',
    })
    return JsonParser.deserializeObject(data, SpecialtyDM);
  }

  @Toast<SpecialtyDM>(() => `Specialty Successfully Grant`)
  static async GRANT(params: {memberId: number, specialtyId: number}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `members/${params.memberId}/specialties/${params.specialtyId}`,
      method: 'GRANT',
    })
    return JsonParser.deserializeObject(data, SpecialtyDM);
  }
  
  @Toast<SpecialtyDM>(() => `Specialty Successfully Deny`)
  static async DENY(params: {memberId: number, specialtyId: number}) {
    // @ts-ignore
    const { data } = await DolphinService({
      url: `members/${params.memberId}/specialties/${params.specialtyId}`,
      method: 'DENY',
      data: {
      }
    })
    return JsonParser.deserializeObject(data, SpecialtyDM);
  }
}
