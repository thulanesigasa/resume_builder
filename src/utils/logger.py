import logging
import os
from src.config import LOGS_DIR

if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

# Configure the root logger
logger = logging.getLogger("ResumeBuilder")
logger.setLevel(logging.INFO)

# Formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# File Handler
fh = logging.FileHandler(os.path.join(LOGS_DIR, "app.log"))
fh.setFormatter(formatter)

# Console Handler
ch = logging.StreamHandler()
ch.setFormatter(formatter)

# Prevent duplicate handlers if module is reloaded
if not logger.handlers:
    logger.addHandler(fh)
    logger.addHandler(ch)
