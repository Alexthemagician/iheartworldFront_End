export class User {
    static userName: string;
    constructor(public id : string,
                public userName: string,
                public userPassword: string,
                public profileImgUrl: string,
                public about: string,
                public userPost: Array<string>,
    ) {

    }
}
