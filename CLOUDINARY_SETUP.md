# Cloudinary Setup for Venturo

## Environment Variables

Add these to your `.env.local` file:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dfkxekhgx
CLOUDINARY_API_KEY=436655275826188
CLOUDINARY_API_SECRET=XyvUzaJCU-RVJzjuI2vEvm9Gnss

# Alternative: You can also use the CLOUDINARY_URL format
CLOUDINARY_URL=cloudinary://436655275826188:XyvUzaJCU-RVJzjuI2vEvm9Gnss@dfkxekhgx
```

## Installation

1. Install Cloudinary package:
```bash
npm install cloudinary
```

2. Get your Cloudinary API Secret:
   - Go to your Cloudinary Dashboard
   - Click "View API Keys" 
   - Copy your API Secret
   - Replace `your_cloudinary_api_secret` in `.env.local`

## Features

### Image Upload
- **Company Logos**: Users can upload company logos when creating startup ideas
- **Additional Images**: Support for up to 4 additional images per idea
- **Auto Optimization**: Images are automatically optimized for web delivery
- **Secure URLs**: All images use HTTPS secure URLs

### Image Management
- **Unique IDs**: Each image gets a unique public_id for easy management
- **Folder Organization**: Images are stored in a 'venturo' folder
- **Auto Format**: Images are automatically converted to optimal format (WebP/AVIF)
- **Auto Quality**: Quality is automatically optimized for file size vs quality

### Database Storage
- **URL Storage**: Image URLs are stored in the database
- **Public ID Storage**: Cloudinary public_ids are stored for future management
- **Metadata**: Image dimensions are stored for responsive display

## Usage

### Uploading Images
```javascript
// The upload happens automatically when users select files
// Images are uploaded to Cloudinary and URLs are stored in the database
```

### Displaying Images
```javascript
// Images are displayed using the secure URLs from Cloudinary
<img src={image.url} alt="Company logo" />
```

### Deleting Images
```javascript
// Images can be deleted from Cloudinary using the public_id
// This is handled automatically when users remove images
```

## Benefits

1. **Performance**: Images are automatically optimized and served via CDN
2. **Scalability**: Cloudinary handles image processing and delivery
3. **Cost Effective**: Free tier includes 25GB storage and 25GB bandwidth
4. **Security**: All images use secure HTTPS URLs
5. **Responsive**: Automatic format and quality optimization
