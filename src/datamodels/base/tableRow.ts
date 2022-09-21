import { JsonObject, JsonProperty } from "json2typescript";
import datamodel from "@/datamodels/base/datamodel";

@JsonObject("TableRow")
export default class TableRow extends datamodel {
    @JsonProperty("id", Number)
    id: number | undefined = undefined;
}
