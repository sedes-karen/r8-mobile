import { apiClient } from "./apiClient";
import { readApiError } from "./apiErrors";
import type { LabelProfile } from "../../types/label";

export type UpdateLabelProfileInput= Partial<Pick<
        LabelProfile,
        |"name"
        | "description"
        |"instagramUrl"
        |"soundcloudUrl"
        |"bandcampUrl"
        |"twitterUrl"
    >
>;

export type LabelPorfileImageResponse={
    url:string|null;
    expiresAt?:string;  
};

export type CreateLabelImageUploadInput={
    contentType:string;
};

export type CreateLabelImageUploadResponse={
    uploadUrl:string;
    expiresIn:number;
    path:string;
}

export type ConfirmLabelImageInput={
    path:string;
}

/* GET , para obtener el perfil del sello*/

export async function getLabelProfile(): Promise<LabelProfile> {
        const response= await apiClient("/labels/me");

        if(!response.ok){
            throw await readApiError(response, " No se ha podido cargar el perfil del sello ")
        };

        return response.json() as Promise<LabelProfile>;
    }