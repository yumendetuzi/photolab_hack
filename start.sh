#!/bin/bash
gunicorn --bind=0.0.0.0:8000 \
         --workers=4 \
         -k gthread \
         --thread=2 \
         --timeout 30 \
         --graceful-timeout 30 \
         --chdir /root/photolab_hack app:app \
         --preload \
         --max-requests 10
