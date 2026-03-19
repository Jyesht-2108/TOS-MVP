#!/bin/bash

# Quick Cleanup - No prompts, just ends all active trips
# Use this when you know you want to clean up

set -e

echo "🔄 Ending all active trips..."

# End all active trips using postgres user
RESULT=$(sudo -u postgres psql -d tos_db -t -A -c "
UPDATE trips 
SET status = 'ENDED', end_time = COALESCE(end_time, NOW())
WHERE status = 'ACTIVE'
RETURNING id;
" 2>&1)

if [ $? -eq 0 ]; then
    COUNT=$(echo "$RESULT" | grep -v '^$' | wc -l)
    if [ "$COUNT" -gt 0 ]; then
        echo "✅ Ended $COUNT active trip(s)"
    else
        echo "✅ No active trips found"
    fi
    echo ""
    echo "You can now start new trips from the driver mobile app."
else
    echo "❌ Error: $RESULT"
    exit 1
fi
