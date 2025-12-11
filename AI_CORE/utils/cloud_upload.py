import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_to_cloudinary(file_path: str, folder: str):
    """
    Upload file to Cloudinary and return secure URL
    """
    response = cloudinary.uploader.upload(
        file_path,
        folder=folder,
        resource_type="auto"  # VERY IMPORTANT (can upload images AND audio)
    )
    return response["secure_url"]
