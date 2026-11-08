# SQL migrations

Use ordered filenames such as `0001_identity_stores.sql`. Tables and columns use English names. This directory will contain the relational application schema; the D1 platform probe under `backend/probes/` is deliberately separate and is never an application migration.

Keep tenant IDs in composite keys and foreign keys. Store money in integer cents, instants in UTC, and offer/coupon dates as Lima calendar dates. Migrations must preserve historical order snapshots and the distinction between inherited, absent and custom measurement tables.

`0001_auth.sql` is generated from Better Auth 1.7.18 using `node backend/scripts/generate-auth.mjs`. `0002_stores.sql` owns stores, memberships and initial payment/delivery settings. Do not create a document-per-store table as a fallback.
