import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { isNumber } from "lodash";

@JsonConverter
export class NuggetNumberConverter implements JsonCustomConvert<String> {
    serialize(data: string) {
        return data;
    }
    deserialize(data?: number | string): string {
        return !data ? '' : isNumber(data) ? `N${data}` : data;
    }
}