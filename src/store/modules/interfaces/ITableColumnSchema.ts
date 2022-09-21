import { TABLE_FILTER_TYPE, TABLE_SORT_TYPE} from "@/utils/constants";

export interface ITableColumnSchema {
    id: string
    type: string
    title: string
    path: any
    headerType?: string
    minWidth?: string
    maxWidth?: string
    width?: string
    whiteSpace?: string
    filterType?: TABLE_FILTER_TYPE
    sortField?: TABLE_SORT_TYPE
}
