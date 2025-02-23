# Heath
Ledger App for auditing Money

# Main features
1. Create different Ledgers
2. Register amount and description from Ledger
3. Add Signature/Receipt for each amount
4. Running balance for each audit entry

# Usage
1. Update Admin account credentials in .env file 
2. Update URL in .env file
3. Update Firebase/MariaDb info in .env file
4. Run the application 
5. View the Admins table from Firebase/MariaDb and copy the GUID of one admin
6. Access BASE_URL/owners/{Admin GUID} with the Admin GUID From step 5
7. Add Owners
8. Access the Owners Link
9. Add Audit
10. The Audit link is now shareable for use