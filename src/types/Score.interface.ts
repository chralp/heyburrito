export default interface Score {
    _id:string;
    to:string;
    from:string;
    value:number;
    contextId?: string;
    parentContextId?: string;
    given_at:Date;
}
