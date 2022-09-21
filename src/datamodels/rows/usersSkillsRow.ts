import TableRow from "@/datamodels/base/tableRow"
import {JsonObject, JsonProperty} from "json2typescript"

@JsonObject("UsersSkillsRow")
export default class UsersSkillsRow extends TableRow {
    @JsonProperty("id", Number)
    id: number | undefined = undefined

    get del() {
        return 'X';
    }

    @JsonProperty("skill", Object, true)
    skill: object | undefined = undefined

    @JsonProperty("specialties", [], true)
    specialties: [] | undefined = undefined;
    
    oldSkillId: number | undefined = this.id

}
