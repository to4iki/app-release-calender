#!/bin/bash

# This script combines all files in .cline/rules/ directory and creates a .clinerules file

# Set the source directory and output file
RULES_DIR=".cline/rules"
OUTPUT_FILE=".clinerules"

# Check if rules directory exists
if [ ! -d "$RULES_DIR" ]; then
  echo "Error: $RULES_DIR directory does not exist."
  exit 1
fi

# Create or clear the output file
> "$OUTPUT_FILE"

# Find all files in the rules directory and append them to the output file
echo "Combining rules from $RULES_DIR to $OUTPUT_FILE..."
find "$RULES_DIR" -type f | sort | while read file; do
  echo "- Processing $file"
  echo "# [$(basename "$file")]" >> "$OUTPUT_FILE"
  cat "$file" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"  # Add an empty line for separation
done

echo "Done! Created $OUTPUT_FILE successfully."
