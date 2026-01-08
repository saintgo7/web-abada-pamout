#!/bin/bash

################################################################################
# Program Portfolio Management System - Documentation Conversion Script
# Converts a single markdown file to DOCX format using Pandoc
#
# Usage: ./convert_to_docx.sh <input_file> [output_file]
# Example: ./convert_to_docx.sh ko/01_PRD.md
#          ./convert_to_docx.sh ko/01_PRD.md output/PRD_Korean.docx
################################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Pandoc is installed
if ! command -v pandoc &> /dev/null; then
    print_error "Pandoc is not installed!"
    echo ""
    echo "Install Pandoc:"
    echo "  macOS:   brew install pandoc"
    echo "  Linux:   sudo apt-get install pandoc"
    echo "  Windows: choco install pandoc"
    exit 1
fi

# Check if input file is provided
if [ -z "$1" ]; then
    print_error "Input file not specified!"
    echo ""
    echo "Usage: $0 <input_file> [output_file]"
    echo "Example: $0 ko/01_PRD.md"
    echo "         $0 ko/01_PRD.md output/PRD.docx"
    exit 1
fi

INPUT_FILE="$1"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    print_error "Input file not found: $INPUT_FILE"
    exit 1
fi

# Determine output file
if [ -z "$2" ]; then
    # Auto-generate output filename
    BASENAME=$(basename "$INPUT_FILE" .md)
    LANGUAGE=$(echo "$INPUT_FILE" | cut -d'/' -f1)

    # Create output directory if it doesn't exist
    mkdir -p output

    OUTPUT_FILE="output/${BASENAME}.docx"
else
    OUTPUT_FILE="$2"
fi

# Get document title from markdown
TITLE=$(grep -m 1 '^# ' "$INPUT_FILE" | sed 's/^# //' || echo "Document")

# Get current date
DATE=$(date +"%Y-%m-%d")

# Detect if document contains Korean characters
if grep -q '[가-힣]' "$INPUT_FILE"; then
    print_info "Korean characters detected. Using CJK font settings..."
    FONT_SETTINGS="--variable mainfont=NotoSansCJK"
else
    print_info "English document detected."
    FONT_SETTINGS="--variable mainfont=Arial"
fi

print_info "Converting: $INPUT_FILE"
print_info "Output: $OUTPUT_FILE"
print_info "Title: $TITLE"
print_info "Date: $DATE"
echo ""

# Convert using Pandoc
print_info "Running Pandoc..."
pandoc "$INPUT_FILE" \
    -o "$OUTPUT_FILE" \
    --toc \
    --toc-depth=2 \
    --highlight-style=tango \
    --resource-path=. \
    --metadata title="$TITLE" \
    --metadata date="$DATE" \
    --metadata author="ABADA Inc." \
    $FONT_SETTINGS \
    --standalone

# Check if conversion was successful
if [ $? -eq 0 ]; then
    print_info "✓ Conversion successful!"
    echo ""
    print_info "Output file: $OUTPUT_FILE"

    # Get file size
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || echo "N/A")
    else
        # Linux
        SIZE=$(stat -c%s "$OUTPUT_FILE" 2>/dev/null || echo "N/A")
    fi

    # Convert to human-readable size
    if [ "$SIZE" != "N/A" ]; then
        if [ $SIZE -lt 1024 ]; then
            SIZE_HUMAN="${SIZE} B"
        elif [ $SIZE -lt 1048576 ]; then
            SIZE_HUMAN="$(( SIZE / 1024 )) KB"
        else
            SIZE_HUMAN="$(( SIZE / 1048576 )) MB"
        fi
        print_info "File size: $SIZE_HUMAN"
    fi

    echo ""
    print_info "You can open the DOCX file with Microsoft Word, Google Docs, LibreOffice, or any compatible application."
else
    print_error "Conversion failed!"
    exit 1
fi
