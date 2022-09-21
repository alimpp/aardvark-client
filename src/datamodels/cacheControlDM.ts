import { JsonObject } from "json2typescript";
import Datamodel from "./base/datamodel";
 
@JsonObject("CacheControlDM")
export default class CacheControlDM extends Datamodel {
    cacheControl = "";
    id = "";
    respons: any ;
    date = new Date();
}
