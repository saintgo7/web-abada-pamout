#!/bin/bash

################################################################################
# Program Portfolio Management System - Batch Conversion Script
# Converts all markdown files in a language folder to DOCX format
#
# Usage: ./convert_all.sh <language> [parallel]
# Example: ./convert_all.sh ko        # Convert all Korean documents sequentially
#          ./convert_all.sh en parallel  # Convert all English documents in parallel
################################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
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

# Check if language folder is specified
if [ -z "$1" ]; then
    print_error "Language folder not specified!"
    echo ""
    echo "Usage: $0 <language> [parallel]"
    echo "Example: $0 ko"
    echo "         $0 en parallel"
    echo ""
    echo "Available language folders:"
    echo "  ko  - Korean documents"
    echo "  en  - English documents"
    exit 1
fi

LANGUAGE="$1"
PARALLEL_MODE="$2"

# Validate language folder
if [ ! -d "$LANGUAGE" ]; then
    print_error "Language folder not found: $LANGUAGE"
    exit 1
fi

# Create output directory with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_DIR="output/${LANGUAGE}_${TIMESTAMP}"
mkdir -p "$OUTPUT_DIR"

# Create log file
LOG_FILE="$OUTPUT_DIR/conversion.log"

print_info "=========================================="
print_info "Program Portfolio Management System"
print_info "Batch Documentation Conversion"
print_info "=========================================="
echo ""
print_info "Language folder: $LANGUAGE"
print_info "Output directory: $OUTPUT_DIR"
print_info "Log file: $LOG_FILE"
print_info "Parallel mode: ${PARALLEL_MODE:-sequential}"
echo ""

# Initialize counters
TOTAL_FILES=0
SUCCESS_COUNT=0
FAILED_COUNT=0
START_TIME=$(date +%s)

# Function to convert single file
convert_file() {
    local INPUT_FILE="$1"
    local OUTPUT_DIR="$2"
    local LOG_FILE="$3"

    local BASENAME=$(basename "$INPUT_FILE" .md)
    local OUTPUT_FILE="$OUTPUT_DIR/${BASENAME}.docx"

    # Get document title
    local TITLE=$(grep -m 1 '^# ' "$INPUT_FILE" | sed 's/^# //' || echo "Document")

    # Detect language for font settings
    if grep -q '[가-힣]' "$INPUT_FILE"; then
        local FONT_SETTINGS="--variable mainfont=NotoSansCJK"
    else
        local FONT_SETTINGS="--variable mainfont=Arial"
    fi

    # Convert
    if pandoc "$INPUT_FILE" \
        -o "$OUTPUT_FILE" \
        --toc \
        --toc-depth=2 \
        --highlight-style=tango \
        --metadata title="$TITLE" \
        --metadata date="$(date +"%Y-%m-%d")" \
        --metadata author="ABADA Inc." \
        $FONT_SETTINGS \
        --standalone 2>/dev/null; then
        echo "✓ $BASENAME" | tee -a "$LOG_FILE"
        return 0
    else
        echo "✗ $BASENAME" | tee -a "$LOG_FILE"
        return 1
    fi
}

# Export function for parallel execution
export -f convert_file print_info print_error

# Collect all markdown files
print_step "Collecting markdown files..."
FILES=($(find "$LANGUAGE" -name "*.md" -type f | sort))
TOTAL_FILES=${#FILES[@]}

if [ $TOTAL_FILES -eq 0 ]; then
    print_error "No markdown files found in $LANGUAGE folder"
    exit 1
fi

print_info "Found $TOTAL_FILES markdown files"
echo ""

# Convert files
print_step "Starting conversion..."
echo ""

if [ "$PARALLEL_MODE" = "parallel" ]; then
    print_info "Running conversions in parallel..."
    echo ""

    # Run conversions in parallel using xargs
    printf '%s\n' "${FILES[@]}" | xargs -I {} -P $(nproc) bash -c '
        INPUT_FILE="{}"
        BASENAME=$(basename "$INPUT_FILE" .md)
        OUTPUT_FILE="'"$OUTPUT_DIR"'/${BASENAME}.docx"
        TITLE=$(grep -m 1 "^# " "$INPUT_FILE" | sed "s/^# //" || echo "Document")

        if grep -q "[가-힣]" "$INPUT_FILE"; then
            FONT_SETTINGS="--variable mainfont=NotoSansCJK"
        else
            FONT_SETTINGS="--variable mainfont=Arial"
        fi

        if pandoc "$INPUT_FILE" \
            -o "$OUTPUT_FILE" \
            --toc \
            --toc-depth=2 \
            --highlight-style=tango \
            --metadata title="$TITLE" \
            --metadata date="$(date +"%Y-%m-%d")" \
            --metadata author="ABADA Inc." \
            $FONT_SETTINGS \
            --standalone 2>/dev/null; then
            echo "✓ $BASENAME"
        else
            echo "✗ $BASENAME"
        fi
    ' 2>&1 | tee -a "$LOG_FILE"
else
    # Sequential processing
    for FILE in "${FILES[@]}"; do
        BASENAME=$(basename "$FILE" .md)
        printf "Converting: %-40s " "$BASENAME..."

        if convert_file "$FILE" "$OUTPUT_DIR" "$LOG_FILE"; then
            ((SUCCESS_COUNT++))
        else
            ((FAILED_COUNT++))
        fi
    done
fi

# Calculate elapsed time
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
MINUTES=$((ELAPSED / 60))
SECONDS=$((ELAPSED % 60))

# Count successful conversions if parallel mode
if [ "$PARALLEL_MODE" = "parallel" ]; then
    SUCCESS_COUNT=$(grep -c "^✓" "$LOG_FILE" || echo 0)
    FAILED_COUNT=$(grep -c "^✗" "$LOG_FILE" || echo 0)
fi

# Summary
echo ""
print_info "=========================================="
print_info "Conversion Summary"
print_info "=========================================="
echo ""
print_info "Total files:    $TOTAL_FILES"
print_info "Successful:     $SUCCESS_COUNT"
print_info "Failed:         $FAILED_COUNT"
print_info "Elapsed time:   ${MINUTES}m ${SECONDS}s"
print_info "Output folder:  $OUTPUT_DIR"
echo ""

if [ $FAILED_COUNT -eq 0 ]; then
    print_info "✓ All files converted successfully!"
    echo ""
    print_info "You can find all DOCX files in: $OUTPUT_DIR"
else
    print_warning "Some files failed to convert. Check $LOG_FILE for details."
fi

echo ""
print_info "Conversion log saved to: $LOG_FILE"

exit 0
