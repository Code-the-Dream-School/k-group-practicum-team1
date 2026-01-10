#!/bin/bash
# /k-group-practicum-team1/script/verify.sh
# Pre-push verification script - ensures code quality before pushing
set -e

echo "========================================"
echo "Running Pre-Push Verification Checks"
echo "========================================"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

FAILED=0

echo ""
echo "1. Backend: RuboCop Lint"
echo "----------------------------------------"
cd backend
if bundle exec rubocop --parallel; then
    echo -e "${GREEN}✓ RuboCop passed${NC}"
else
    echo -e "${RED}✗ RuboCop failed${NC}"
    FAILED=1
fi

echo ""
echo "2. Backend: RSpec Tests"
echo "----------------------------------------"
if bundle exec rspec; then
    echo -e "${GREEN}✓ RSpec passed${NC}"
else
    echo -e "${RED}✗ RSpec failed${NC}"
    FAILED=1
fi
cd ..

echo ""
echo "3. Frontend: ESLint"
echo "----------------------------------------"
cd frontend
if npm run lint; then
    echo -e "${GREEN}✓ ESLint passed${NC}"
else
    echo -e "${RED}✗ ESLint failed${NC}"
    FAILED=1
fi

echo ""
echo "4. Frontend: Build"
echo "----------------------------------------"
if npm run build; then
    echo -e "${GREEN}✓ Build passed${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    FAILED=1
fi
cd ..

echo ""
echo "========================================"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All checks passed! Safe to push.${NC}"
    exit 0
else
    echo -e "${RED}Some checks failed. Please fix before pushing.${NC}"
    exit 1
fi
