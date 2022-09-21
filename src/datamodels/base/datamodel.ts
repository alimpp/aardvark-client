import {JsonParser} from "@/utils/jsonparser";
import {JsonObject} from "json2typescript";

@JsonObject("Datamodel")
export default class Datamodel {
    __class: string;

    constructor() {
        this.__class = this.constructor.name
    }

    public serialize() {
        return JsonParser.serializeObject(this);
    }

    public isEmpty() {
        return Object.values(this).every(el => el === undefined)
    }
}
