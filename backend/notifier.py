import urllib.request
import json
import logging

def send_discord_notification(webhook_url: str, message: str):
    if not webhook_url:
        return
    
    data = {
        "content": message,
        "username": "MedTracker",
        "avatar_url": "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/activity.svg"
    }
    
    req = urllib.request.Request(
        webhook_url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': 'MedTracker-Bot'}
    )
    
    try:
        urllib.request.urlopen(req)
    except Exception as e:
        logging.error(f"Failed to send Discord notification: {e}")
