export class Newsfeed {    
    constructor(public userId: string,
                public postText: string,
                public postImgUrl: string,
                public postVideoUrl: string,
                public dateCreated: Date,
                public lastUpdated: Date,
                public postId: number
    ) {

    }
    public emojiList: string[] = [];
    public addEmoji(emoji: string) {
        this.emojiList.push(emoji);
    }
}
