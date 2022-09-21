import { HolidayTypesDSModule } from '@/store';
import { JsonObject, JsonProperty, JsonConverter, JsonCustomConvert} from "json2typescript";
import Datamodel from './base/datamodel';

@JsonConverter
class HolidayTypeTitleConverter implements JsonCustomConvert<String> {
  serialize(data: string): any {
    return data;
  }
  deserialize(data: number): string {
    const holiday = HolidayTypesDSModule.items[data];
    if (holiday) {
      return holiday.title.capitalize();
    }
    return '';
  }
}

@JsonObject('HolidayDM')
export default class HolidayDM extends Datamodel {
  @JsonProperty("id", Number) id = 0;
  @JsonProperty("holidayTypeId", Number, true) holidayTypeId = 0;
  @JsonProperty("holidayTypeId", HolidayTypeTitleConverter, true) holidayTypeTitle = '';
  @JsonProperty("memberId", Number, true) memberId = 0;
  @JsonProperty("organizationId", Number, true) organizationId = 0;
  @JsonProperty("title", String) title = '';
  @JsonProperty("startDate", String) startDate = '';
  @JsonProperty("endDate", String) endDate = '';
  @JsonProperty("repeat", String, true) repeat = '';
  @JsonProperty("removedAt", String, true) removedAt: string | null = ''
}
