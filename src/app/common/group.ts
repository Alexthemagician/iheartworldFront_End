import { User } from "./user";

export class Group {
    constructor(public groupId: number,
                public groupName: string,
                public groupDescription: string,
                public groupImgUrl: string,
                public membersList: User[],
                public groupAdmin: string,
                public dateCreated: Date,
            ) {
    }
}
