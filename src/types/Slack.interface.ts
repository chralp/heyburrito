declare module Slack {

    /**
     * Interface describes object for stored user or bot
     */
    export interface Stored {
        id: string;
        name: string;
        avatar: string;
    }

    export interface Profile {
        title: string;
        phone: string;
        skype: string;
        real_name: string;
        real_name_normalized: string;
        display_name: string;
        display_name_normalized: string;
        fields?: any;
        status_text: string;
        status_emoji: string;
        status_expiration: number;
        avatar_hash: string;
        always_active: boolean;
        first_name: string;
        last_name: string;
        image_24: string;
        image_32: string;
        image_48: string;
        image_72: string;
        image_192: string;
        image_512: string;
        status_text_canonical: string;
        team: string;
        email: string;
        bot_id: string;
        api_app_id: string;
        image_original: string;
        image_1024: string;
        is_custom_image?: boolean;
    }

    export interface Member {
        id: string;
        team_id: string;
        name: string;
        deleted: boolean;
        color: string;
        real_name: string;
        tz: string;
        tz_label: string;
        tz_offset: number;
        profile: Profile;
        is_admin: boolean;
        is_owner: boolean;
        is_primary_owner: boolean;
        is_restricted: boolean;
        is_ultra_restricted: boolean;
        is_bot: boolean;
        is_app_user: boolean;
        updated: number;
    }

    export interface ResponseMetadata {
        next_cursor: string;
    }

    export interface WbcList {
        ok: boolean;
        members: Member[];
        cache_ts: number;
        response_metadata: ResponseMetadata;
        scopes: string[];
        acceptedScopes: string[];
    }

}


export default Slack;
