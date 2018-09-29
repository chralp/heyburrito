export default interface SlackMessage {
    subtype: string;
    channel: string;
    user: string;
    type: string;
    text: string;
}
