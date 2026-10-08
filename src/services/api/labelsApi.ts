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

export type LabelProfileImageResponse={
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

export async function fetchLabelMe(): Promise<LabelProfile> {
        const response= await apiClient("/labels/me");

        if(!response.ok){
            throw await readApiError(response, " No se ha podido cargar el perfil del sello ")
        };

        return response.json() as Promise<LabelProfile>;
    }

/* Actualizar el perfil  */
export async function updateLabelProfile(
    data: UpdateLabelProfileInput
): Promise<LabelProfile> {
    const response = await apiClient("/labels/me", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw await readApiError(
            response,
            "No se ha podido actualizar el perfil del sello"
        );
    }

    return response.json() as Promise<LabelProfile>;
}

/* URL de la imagen actual */
export async function getLabelProfileImage(): Promise<LabelProfileImageResponse> {
    const response = await apiClient("/labels/me/profile-image");

    if (!response.ok) {
        throw await readApiError(
            response,
            "No se ha podido obtener la imagen del sello"
        );
    }

    return response.json() as Promise<LabelProfileImageResponse>;
}

/* Pedir una URL temporal para subir una imagen */
export async function createLabelImageUpload(
    data: CreateLabelImageUploadInput
): Promise<CreateLabelImageUploadResponse> {
    const response = await apiClient("/labels/me/profile-image", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw await readApiError(
            response,
            "No se ha podido preparar la subida de la imagen"
        );
    }

    return response.json() as Promise<CreateLabelImageUploadResponse>;
}

export async function confirmLabelImage(
    data: ConfirmLabelImageInput
): Promise<void> {
    const response = await apiClient("/labels/me/profile-image/confirm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw await readApiError(
            response,
            "No se ha podido confirmar la imagen del sello"
        );
    }
}