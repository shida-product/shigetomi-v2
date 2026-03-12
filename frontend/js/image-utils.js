/**
 * Utility for compressing images on the client side before upload
 * Helps save storage space and bandwidth
 */

export const ImageUtils = {
    /**
     * Compress an image file to a maximum dimension and file size approximation
     * @param {File} file - Original image file
     * @param {number} maxWidthOrHeight - Maximum dimension (width or height)
     * @param {number} quality - JPEG compression quality (0.0 to 1.0)
     * @returns {Promise<File>} - Compressed image file
     */
    compressImage: (file, maxWidthOrHeight = 1200, quality = 0.7) => {
        return new Promise((resolve, reject) => {
            if (!file.type.match(/image.*/)) {
                return reject(new Error("File is not an image"));
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidthOrHeight) {
                            height *= maxWidthOrHeight / width;
                            width = maxWidthOrHeight;
                        }
                    } else {
                        if (height > maxWidthOrHeight) {
                            width *= maxWidthOrHeight / height;
                            height = maxWidthOrHeight;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        const newFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });
                        resolve(newFile);
                    }, 'image/jpeg', quality);
                };
            };
            reader.onerror = (error) => reject(error);
        });
    }
};
