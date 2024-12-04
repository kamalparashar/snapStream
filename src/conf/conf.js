const conf = {
    apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: String(import.meta.env.VITE_FIREBASE_APP_ID),
    measurementId: String(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID),
    
    RTE_KEY: String(import.meta.env.VITE_RTE_KEY),

    cloudinaryName: String(import.meta.env.VITE_CLOUDINARY_NAME),
    cloudinaryApiKey: String(import.meta.env.VITE_CLOUDINARY_API_KEY),
    cloudinaryApiSecret: String(import.meta.env.VITE_CLOUDINARY_API_SECRET),
    cloudinaryUploadPreset: String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
}

export default conf;