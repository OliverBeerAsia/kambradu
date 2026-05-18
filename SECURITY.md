# Security

## Reporting

For now, report security issues privately to the project owner before opening a public issue.

## Sensitive Data

- Never commit `.env.local`, Firebase service accounts, raw source PDFs, bulk extracted dictionary text, private user journals, consent profiles, or uploaded media.
- Firestore rules keep journal, saved-word, goal, contribution, and steward actions behind authentication and ownership/role checks.
- Storage rules keep uploaded recordings private to the owner and stewards by default.

## Public Content

Only content with `reviewStatus: "approved"` and `access: "open"` should be public without sign-in. Community and restricted material must remain behind membership or steward access.
