import os
import shutil
import time
import asyncio
import logging
from pathlib import Path
from ..config import STORAGE_DIR, JOB_RETENTION_MINUTES

logger = logging.getLogger(__name__)

def cleanup_expired_jobs():
    if not STORAGE_DIR.exists():
        return
    now = time.time()
    cutoff = now - (JOB_RETENTION_MINUTES * 60)
    for entry in STORAGE_DIR.iterdir():
        if entry.is_dir():
            try:
                mtime = entry.stat().st_mtime
                if mtime < cutoff:
                    shutil.rmtree(entry, ignore_errors=True)
                    logger.info(f"Cleaned up expired job directory: {entry.name}")
            except Exception as e:
                logger.error(f"Error checking/cleaning {entry}: {e}")

async def cleanup_loop():
    while True:
        try:
            cleanup_expired_jobs()
        except Exception as e:
            logger.error(f"Error in cleanup loop: {e}")
        await asyncio.sleep(600) # Run every 10 minutes
