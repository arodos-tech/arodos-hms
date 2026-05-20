export interface UploadResult {
    url: string;
    name: string;
    type: string;
    size: number;
}

export async function uploadFile(file: File): Promise<UploadResult | null> {
    const formData = new FormData();
    formData.append("folder", "bmer/projects");
    formData.append("file", file);

    try {
        const res = await fetch(import.meta.env.VITE_UPLOADS_API_URL!, {
            method: "POST",
            headers: {
                username: import.meta.env.VITE_UPLOADS_API_USERNAME,
                password: import.meta.env.VITE_UPLOADS_API_PASSWORD,
            } as any,
            body: formData,
        });

        if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
        const data = await res.json();

        const p = (data?.files?.file ?? data?.files?.image) as string;
        if (!p) return null;

        const parts = p.split("/");
        const serverFileName = parts[parts.length - 1];

        const ext = file.name.split(".").pop()?.toLowerCase() ?? "file";

        return {
            url: serverFileName,
            name: file.name,
            type: ext,
            size: file.size,
        };
    } catch (err: any) {
        console.error("Upload Error:", err);
        return null;
    }
}
