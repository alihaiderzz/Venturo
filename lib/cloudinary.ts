import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfkxekhgx', 
    api_key: process.env.CLOUDINARY_API_KEY || '436655275826188', 
    api_secret: process.env.CLOUDINARY_API_SECRET || 'XyvUzaJCU-RVJzjuI2vEvm9Gnss'
});

export { cloudinary };

// Helper function to upload image
export async function uploadImage(file: Buffer, options: {
    public_id?: string;
    folder?: string;
    transformation?: any;
} = {}) {
    try {
        const uploadResult = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${file.toString('base64')}`,
            {
                public_id: options.public_id,
                folder: options.folder || 'venturo',
                transformation: options.transformation || {
                    fetch_format: 'auto',
                    quality: 'auto'
                }
            }
        );
        
        return {
            success: true,
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        };
    }
}

// Helper function to delete image
export async function deleteImage(public_id: string) {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return {
            success: true,
            result
        };
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Delete failed'
        };
    }
}

// Helper function to generate optimized URL
export function getOptimizedUrl(public_id: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
} = {}) {
    return cloudinary.url(public_id, {
        fetch_format: options.format || 'auto',
        quality: options.quality || 'auto',
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
        gravity: 'auto'
    });
}
