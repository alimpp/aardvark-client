import { JsonObject, JsonProperty } from "json2typescript"
import TableRow from "@/datamodels/base/tableRow"
import dayjs from "dayjs";

@JsonObject("SettingsPersonalCalendarRow")
export default class SettingsPersonalCalendarRow extends TableRow {

  @JsonProperty("id", Number)
  id: number | undefined = undefined

  @JsonProperty("title", String)
  title: string | undefined = undefined;

  @JsonProperty("startDate", String)
  startDate: string | undefined = undefined

  @JsonProperty("endDate", String)
  endDate: string | undefined = undefined

  @JsonProperty("holidayTypeTitle", String)
  holidayTypeTitle: string | undefined = undefined

  @JsonProperty("repeat", String)
  repeat: string | undefined = undefined

  @JsonProperty("removedAt", String)
  removedAt: string | undefined  = undefined

  get date() {
    if (this.startDate === this.endDate) {
      return dayjs(this.startDate).format("L")
    } else {
      return `${dayjs(this.startDate).format("L")} - ${dayjs(this.endDate).format("L")}`
    }
  }

  get inactive() {
    return this.removedAt ? 'Yes' : ''
  }
}