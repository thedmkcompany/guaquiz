#!/bin/bash
# Quick API Test - Run this AFTER starting dev server
# Usage: npm run dev (in one terminal), then ./scripts/quick-api-test.sh (in another)

set -e

API_URL="${1:-http://localhost:3000}"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "══════════════════════════════════════════════════════"
echo "         QUICK API TEST"
echo "══════════════════════════════════════════════════════"
echo -e "${NC}"

# Test 1: Health Check
echo -e "${YELLOW}[1/4] Testing API Health...${NC}"
if curl -sf "$API_URL/api/health" > /dev/null; then
    echo -e "${GREEN}✓ API is healthy${NC}\n"
else
    echo -e "${RED}✗ API not accessible at $API_URL${NC}"
    echo -e "${RED}Make sure dev server is running: npm run dev${NC}"
    exit 1
fi

# Test 2: Create Order
echo -e "${YELLOW}[2/4] Creating Razorpay Order...${NC}"
ORDER_RESPONSE=$(curl -sf -X POST "$API_URL/api/payment/razorpay/create-order" \
    -H "Content-Type: application/json" \
    -d '{
        "amount": 99900,
        "email": "test@example.com",
        "name": "Test Customer",
        "phone": "+919999999999",
        "programId": "essentials"
    }')

if [ $? -eq 0 ]; then
    ORDER_ID=$(echo "$ORDER_RESPONSE" | grep -o '"orderId":"[^"]*"' | cut -d'"' -f4)
    if [ -n "$ORDER_ID" ]; then
        echo -e "${GREEN}✓ Order created: $ORDER_ID${NC}\n"
    else
        echo -e "${RED}✗ Order created but no ID returned${NC}"
        echo "$ORDER_RESPONSE"
        exit 1
    fi
else
    echo -e "${RED}✗ Failed to create order${NC}"
    exit 1
fi

# Test 3: Generate and Verify Signature
echo -e "${YELLOW}[3/4] Generating Payment Signature...${NC}"
PAYMENT_ID="pay_test_$(date +%s)"
SECRET="pD8Z9rJiTdbQmhx9diajqYuF"
SIGNATURE=$(echo -n "${ORDER_ID}|${PAYMENT_ID}" | openssl dgst -sha256 -hmac "$SECRET" | cut -d' ' -f2)
echo -e "${GREEN}✓ Signature generated: ${SIGNATURE:0:20}...${NC}\n"

# Test 4: Verify Payment
echo -e "${YELLOW}[4/4] Verifying Payment...${NC}"
VERIFY_RESPONSE=$(curl -sf -X POST "$API_URL/api/payment/razorpay/verify" \
    -H "Content-Type: application/json" \
    -d "{
        \"razorpay_order_id\": \"$ORDER_ID\",
        \"razorpay_payment_id\": \"$PAYMENT_ID\",
        \"razorpay_signature\": \"$SIGNATURE\"
    }")

if [ $? -eq 0 ]; then
    VERIFIED=$(echo "$VERIFY_RESPONSE" | grep -o '"verified":[^,}]*' | cut -d':' -f2)
    if [ "$VERIFIED" = "true" ]; then
        echo -e "${GREEN}✓ Payment verified successfully${NC}\n"
    else
        echo -e "${RED}✗ Payment verification failed${NC}"
        echo "$VERIFY_RESPONSE"
        exit 1
    fi
else
    echo -e "${RED}✗ Failed to verify payment${NC}"
    exit 1
fi

# Success Summary
echo -e "${CYAN}${BOLD}"
echo "══════════════════════════════════════════════════════"
echo "         ALL TESTS PASSED! ✓"
echo "══════════════════════════════════════════════════════"
echo -e "${NC}"
echo -e "${GREEN}✓ API Health Check${NC}"
echo -e "${GREEN}✓ Order Creation${NC}"
echo -e "${GREEN}✓ Signature Generation${NC}"
echo -e "${GREEN}✓ Payment Verification${NC}"
echo ""
echo -e "${BLUE}Payment flow is working correctly!${NC}"
echo ""
echo -e "${YELLOW}Test Details:${NC}"
echo "  Order ID: $ORDER_ID"
echo "  Payment ID: $PAYMENT_ID"
echo "  Amount: ₹999 (99900 paise)"
echo "  Program: essentials"
echo ""
