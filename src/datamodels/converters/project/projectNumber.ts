import { JsonConverter, JsonCustomConvert } from "json2typescript";
import {isNumber, isString} from "lodash";

@JsonConverter
export class ProjectNumberConverter implements JsonCustomConvert<String> {
    serialize(data: string) {
        return data;
    }
    deserialize(data?: number | string): string {
        return !data ? '' : isNumber(data) ? `P${data}` : data;
    }
}