import io
import pypdf
import pymupdf

def protect_pdf(
    pdf_bytes: bytes,
    user_password: str,
    owner_password: str | None = None,
    allow_printing: bool = True,
    allow_copying: bool = True,
    allow_modifying: bool = False
) -> bytes:
    if not user_password:
        raise ValueError("Password cannot be empty.")

    reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    writer = pypdf.PdfWriter()

    for page in reader.pages:
        writer.add_page(page)

    # Build permissions flag
    perms = 0
    if allow_printing:
        perms |= int(pypdf.constants.UserAccessPermissions.PRINT)
    if allow_copying:
        perms |= int(pypdf.constants.UserAccessPermissions.EXTRACT)
    if allow_modifying:
        perms |= int(pypdf.constants.UserAccessPermissions.MODIFY)

    writer.encrypt(
        user_password=user_password,
        owner_password=owner_password or user_password,
        permissions_flag=pypdf.constants.UserAccessPermissions(perms) if perms else None
    )

    out_bio = io.BytesIO()
    writer.write(out_bio)
    return out_bio.getvalue()

def unlock_pdf(pdf_bytes: bytes, password: str) -> bytes:
    # First test authentication with pymupdf
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    
    if not doc.is_encrypted:
        doc.close()
        return pdf_bytes # Already decrypted

    auth_result = doc.authenticate(password)
    if auth_result == 0:
        doc.close()
        raise ValueError("Incorrect password provided. Please verify and try again.")
        
    # Create unlocked copy
    out_bytes = doc.tobytes(deflate=True)
    doc.close()
    return out_bytes
