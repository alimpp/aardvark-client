import MessageDM from '@/datamodels/messageDM';
import {JsonParser} from '@/utils/jsonparser'
import {JaguarService} from '@/utils/request'
import AttachmentLinkDM from '@/datamodels/attachmentLinkDM';
import {Method} from 'axios';

export default class AttachmentAPI {

	static async LIST_DOCUMENTS({roomId, skip = 0, take= 15, sort = '-createdAt'}: {roomId: number, skip?: number  , take?: number  , sort?: string  }): Promise<MessageDM[]> {

		const {data} = await JaguarService({
			url: `rooms/${roomId}/documents`,
			method: 'LIST' as Method,
			params: {sort, skip, take}
		});
		return JsonParser.deserializeArray<MessageDM>(data || [], MessageDM);
	}
    
    static async LIST_MEDIA({roomId, skip = 0, take = 15, sort = '-createdAt'}: {roomId: number, skip?: number, take?: number, sort?: '-createdAt'}) {
        const { data } = await JaguarService({
            url: `rooms/${roomId}/media`,
            method: 'LIST' as Method,
            params: {sort, skip, take}
        })
        return JsonParser.deserializeArray<MessageDM>(data || [], MessageDM);
    }
    
    static async LIST_LINKS({roomId, skip = 0, take = 15, sort = '-createdAt'}: {roomId: number, skip?: number, take?: number, sort?: string}): Promise<AttachmentLinkDM[]> {
        const {data} = await JaguarService({
            url: `rooms/${roomId}/links`,
            method: 'LIST' as Method,
            params: {sort, skip, take}
        });
        return JsonParser.deserializeArray<AttachmentLinkDM>(data || [], AttachmentLinkDM);
    }

}
