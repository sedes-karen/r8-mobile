import { useCallback, useRef, useState } from "react";
import {createLabelImageUpload,confirmLabelImage,} from "../services/api/labelsApi";

type LabelImageState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; path: string }
    | { status: "error"; message: string };

export function useLabelImage() {
    const [state, setState] = useState<LabelImageState>({
        status: "idle",
    });

    const uploading = useRef(false);

    const uploadImage = useCallback(
        async (uri: string, contentType: string): Promise<string> => {
            if (uploading.current) {
                throw new Error("Ya hay una imagen subiéndose");
            }

            uploading.current = true;
            setState({ status: "loading" });

            try {
                const localResponse = await fetch(uri);
                const image = await localResponse.blob();

                // Pedir al backend una URL temporal de subida.
                const { uploadUrl, path } = await createLabelImageUpload({
                    contentType,
                });

                // Subir el archivo a la  URL.
                const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": contentType,
                    },
                    body: image,
                });

                if (!uploadResponse.ok) {
                    throw new Error(
                        `No se pudo subir la imagen (${uploadResponse.status})`
                    );
                }

                // Confirmar al backend que la subida terminó.
                await confirmLabelImage({ path });

                setState({ status: "success", path });

                return path;
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Error inesperado al subir la imagen";

                setState({ status: "error", message });

                throw error;
            } finally {
                uploading.current = false;
            }
        },
        []
    );

    return { ...state, uploadImage };
}