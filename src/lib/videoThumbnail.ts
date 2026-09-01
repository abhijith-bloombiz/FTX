/**
 * Extracts a video frame snapshot from a video File or URL,
 * uploads it as a JPEG image via /api/admin/upload,
 * and returns the generated image URL.
 */
export async function generateVideoThumbnail(videoFileOrUrl: File | string): Promise<string | null> {
    if (typeof window === "undefined") return null;

    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.muted = true;
        video.playsInline = true;
        video.crossOrigin = "anonymous";
        video.preload = "auto";

        let objectUrl = "";
        if (typeof videoFileOrUrl === "string") {
            video.src = videoFileOrUrl;
        } else {
            objectUrl = URL.createObjectURL(videoFileOrUrl);
            video.src = objectUrl;
        }

        const cleanup = () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            video.remove();
        };

        const timeout = setTimeout(() => {
            cleanup();
            resolve(null);
        }, 10000); // 10s safety fallback timeout

        video.addEventListener("loadeddata", () => {
            // Seek to 1s or middle frame if shorter
            const targetTime = video.duration > 0 ? Math.min(1.0, video.duration / 2) : 0.5;
            video.currentTime = targetTime;
        });

        video.addEventListener("seeked", async () => {
            clearTimeout(timeout);
            try {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 360;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    cleanup();
                    return resolve(null);
                }
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(async (blob) => {
                    cleanup();
                    if (!blob) return resolve(null);

                    const formData = new FormData();
                    formData.append("file", new File([blob], `thumb_${Date.now()}.jpg`, { type: "image/jpeg" }));

                    try {
                        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                        const data = await res.json();
                        if (data.url) resolve(data.url);
                        else resolve(null);
                    } catch {
                        resolve(null);
                    }
                }, "image/jpeg", 0.85);
            } catch (err) {
                console.error("Error creating video frame canvas blob:", err);
                cleanup();
                resolve(null);
            }
        });

        video.addEventListener("error", (e) => {
            clearTimeout(timeout);
            console.error("Video load error during thumbnail generation:", e);
            cleanup();
            resolve(null);
        });

        video.load();
    });
}
